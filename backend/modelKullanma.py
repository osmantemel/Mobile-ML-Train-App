import pandas as pd
import sqlite3
import pickle
import base64
import joblib
import numpy as np
import re

def model_kullanma(id):
    # Veritabanına bağlan
    conn = sqlite3.connect('dosya_veritabani.db')
    cursor = conn.cursor()
    
    # Belirtilen ID ile veritabanından form değerlerini çek 
    cursor.execute("SELECT * FROM form_values ORDER BY rowid DESC LIMIT 1")

    data = cursor.fetchone()

    print("osman teeml",data)
    conn.close()
  
    if data:
        # Form değerlerini yazdır
        print("ID:", data[0])  # ID sütunu
        print("Model ID:", data[1])  # Model ID sütunu
        print("Parametreler:", data[2])  # Parametreler sütunu
        print("Form Değerleri:", data[3])  # Form Değerleri sütunu
    else:
        print("Belirtilen ID ile eşleşen veri bulunamadı.")
        return None
    
    # Modeli oluştur
    model = model_olustur(data[1])
    
    # Form değerlerinden sayıları çıkar
    sayilar = re.findall(r'\d+', data[3])
    sayilar = list(map(int, sayilar))  # Sayıları integer listeye çevir
    
    # Model dosyasını yükle
    model_filename = 'model.pkl'
    model = joblib.load(model_filename)
    
    # Model ile tahmin yap
    pred = model.predict([sayilar])
    print(pred)

    return pred

def model_olustur(model_id):
    # Veritabanına bağlan
    conn = sqlite3.connect('dosya_veritabani.db')
    cursor = conn.cursor()

    # Belirtilen model ID ile veritabanından modeli çek
    cursor.execute("SELECT model FROM model WHERE id = ?", (model_id,))
    modelBase64 = cursor.fetchone()[0]
    conn.close()
    
    # Base64 stringi pickle dosyasına çevir
    output_file = "model.pkl"
    base64toPkl(modelBase64, output_file)
    
    # Pickle dosyasını yükle
    with open(output_file, 'rb') as file:
        model = pickle.load(file)
    
    return model

def base64toPkl(base64_string, output_file):
    try:
        # Base64 stringi binary veriye dönüştür
        binary_data = base64.b64decode(base64_string)
        
        # Binary veriyi pickle dosyasına yaz
        with open(output_file, 'wb') as file:
            file.write(binary_data)
        
        print("Base64 veri başarıyla pickle dosyasına dönüştürüldü:", output_file)
    except Exception as e:
        print("Hata:", str(e))
