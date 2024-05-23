import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
from sklearn.metrics import accuracy_score, mean_squared_error, r2_score
import joblib
import sqlite3
import base64
import os
import json
from tempfile import NamedTemporaryFile

def train_ai(model_id, file_name, data_frame, etiket, model_turu='classification'):
    print("train_ai basladi")
    null_kolonları_sil(data_frame)
    veri_seti_doldur(data_frame)
    kategorik_sutunlari_kodla(data_frame)
    data_frame = ozellikleri_olcekle(data_frame)
    
    # Hedef değişkenin türünü kontrol et ve uygun hale getir
    if model_turu == 'classification':
        data_frame[etiket] = hedef_degiskeni_kategorik_yap(data_frame[etiket])
    
    X_train, X_test, y_train, y_test = verisetini_bol(etiket, data_frame, test_boyutu=0.2, rastgele_durum=42)
    columns = list(X_train.columns)  # columns'ı listeye çevir
    columns_json = json.dumps(columns)  # JSON formatına çevir
    model, dogruluk = model_egit(X_train, X_test, y_train, y_test, model_turu)
    file_name = file_name + '.pkl'
    model_tablosu_olustur()
    modeli_kaydet(model_id, columns_json, model, etiket, file_name, dogruluk)

def null_kolonları_sil(df):
    null_columns = df.columns[df.isnull().all()].tolist()
    df.drop(columns=null_columns, inplace=True)
    print("null_kolonları_sil basarılı")

def veri_seti_doldur(df):
    for col in df.columns:
        most_common_value = df[col].mode()[0]  # En çok tekrar eden değeri bulma
        df[col] = df[col].fillna(most_common_value)  # Null değerleri en çok tekrar eden değerle doldurma
    print("veri_seti_doldur basarılı")
    return df

def kategorik_sutunlari_kodla(df):
    label_encoder = LabelEncoder()
    for sutun in df.columns:
        if df[sutun].nunique() < 10:
            df[sutun] = df[sutun].astype('category')
            df[sutun] = label_encoder.fit_transform(df[sutun])
    print("kategorik_sutunlari_kodla basarılı")
    return df

def ozellikleri_olcekle(df):
    scaler = StandardScaler()
    df[df.columns] = scaler.fit_transform(df[df.columns])
    print("ozellikleri_olcekle basarılı")
    return df

def verisetini_bol(etiket, veri, test_boyutu=0.2, rastgele_durum=None):
    X = veri.drop(columns=[etiket])
    y = veri[etiket]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_boyutu, random_state=rastgele_durum)
    print("verisetini_bol basarılı")
    return X_train, X_test, y_train, y_test

def model_egit(X_train, X_test, y_train, y_test, model_turu='regression'):
    dogruluk = None
    print("Model türü: " + model_turu)
    if model_turu == 'regression':
        model = DecisionTreeRegressor(random_state=42)
        model.fit(X_train, y_train)
        tahminler = model.predict(X_test)
        r2 = r2_score(y_test, tahminler)
        print("Modelin R^2 skoru:", r2)
        dogruluk = r2
    elif model_turu == 'classification':
        model = DecisionTreeClassifier(random_state=42)
        model.fit(X_train, y_train)
        tahminler = model.predict(X_test)
        dogruluk_skoru = accuracy_score(y_test, tahminler)
        print("Modelin doğruluk skoru:", dogruluk_skoru)
        dogruluk = dogruluk_skoru
    else:
        raise ValueError("Geçersiz model türü. 'regresyon' veya 'sınıflandırma' olmalıdır.")
    print("model_egit basarılı")
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

def model_tablosu_olustur():
    conn = sqlite3.connect('dosya_veritabani.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS model (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            model_id TEXT,
            columns TEXT,
            model TEXT,
            etiket TEXT,
            fileName TEXT,
            dogruluk REAL
        )
    ''')
    conn.commit()
    conn.close()



