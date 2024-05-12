import sqlite3
import pandas as pd
import base64
import io
import train_ai_model as tr_ai

def verileri_oku():
    try:
        conn = sqlite3.connect('dosya_veritabani.db')
        cursor = conn.cursor()
        cursor.execute("SELECT data FROM dosyalar ORDER BY id DESC LIMIT 1")
        data = cursor.fetchone()
        conn.close()

        if data:
            print("Veri bulundu")
            data_frame = to_dataframe(data)
            tr_ai.train_ai(data_frame)
        else:
            print("Veri bulunamadı.")
    except Exception as e:
        print("Hata:", str(e))

def to_dataframe(data):
    # Veriyi CSV formatından DataFrame'e dönüştür

    decoded_data = base64.b64decode(data[0])
    csv_data = io.StringIO(decoded_data.decode('utf-8'))
    data_frame = pd.read_csv(csv_data)
    return data_frame


