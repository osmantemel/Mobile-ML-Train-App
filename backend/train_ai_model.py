import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import accuracy_score, r2_score
import joblib
import sqlite3
import base64
import os
import json
from tempfile import NamedTemporaryFile

def train_ai(model_id, file_name, data_frame, etiket, model_turu='classification'):
    print("train_ai başladı")

    # Hedef değişkenin türünü kontrol et ve uygun hale getir
    if model_turu == 'classification':
        data_frame[etiket] = hedef_degiskeni_kategorik_yap(data_frame[etiket])
    
    X_train, X_test, y_train, y_test = verisetini_bol(etiket, data_frame, test_boyutu=0.2, rastgele_durum=42)
    columns = list(X_train.columns)  # columns'ı listeye çevir
    columns_json = json.dumps(columns)  # JSON formatına çevir
    model, dogruluk = model_egit(X_train, X_test, y_train, y_test, model_turu)
    file_name = file_name + '.pkl'
    modeli_kaydet(model_id, columns_json, model, etiket, file_name, dogruluk)



def verisetini_bol(etiket, veri, test_boyutu=0.2, rastgele_durum=None):
    X = veri.drop(columns=[etiket])
    y = veri[etiket]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_boyutu, random_state=rastgele_durum)
    print("verisetini_bol başarılı")
    return X_train, X_test, y_train, y_test

def model_egit(X_train, X_test, y_train, y_test, model_turu='regression'):
    dogruluk = None
    print("Model türü: " + model_turu)
    if model_turu == 'regression':
        model = RandomForestRegressor(random_state=42)
        model.fit(X_train, y_train)
        tahminler = model.predict(X_test)
        r2 = r2_score(y_test, tahminler)
        print("Modelin R^2 skoru:", r2)
        dogruluk = r2
    elif model_turu == 'classification':
        model = RandomForestClassifier(random_state=42)
        model.fit(X_train, y_train)
        tahminler = model.predict(X_test)
        dogruluk_skoru = accuracy_score(y_test, tahminler)
        print("Modelin doğruluk skoru:", dogruluk_skoru)
        dogruluk = dogruluk_skoru
    else:
        raise ValueError("Geçersiz model türü. 'regresyon' veya 'sınıflandırma' olmalıdır.")
    print("model_egit başarılı")
    return model, dogruluk

def modeli_kaydet(model_id, columns, model, etiket, file_name, dogruluk):              
    model_base64_str = model_base64(model)
    # Veritabanına veriyi ekleme
    conn = sqlite3.connect('dosya_veritabani.db')
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO model (model_id, columns, model, etiket, fileName, dogruluk)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (model_id, columns, model_base64_str, etiket, file_name, dogruluk))
    conn.commit()
    conn.close()

def model_base64(model):
    # Geçici dosya oluştur
    with NamedTemporaryFile(delete=False) as tmp_file:
        temp_file_name = tmp_file.name
    # Modeli geçici dosyaya serileştir
    joblib.dump(model, temp_file_name)
    # Geçici dosyayı okuyup base64 formatına çevir
    with open(temp_file_name, 'rb') as file:
        model_base64_str = base64.b64encode(file.read()).decode('utf-8')
    # Geçici dosyayı sil
    os.remove(temp_file_name)
    return model_base64_str

def hedef_degiskeni_kategorik_yap(y):
    # Sürekli değişkeni kategorik hale getir (örneğin, belirli eşiklerle bölerek)
    y_kategorik = pd.cut(y, bins=5, labels=False)
    return y_kategorik

