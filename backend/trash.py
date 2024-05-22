        # with open(name, "wb") as file:
        #     file.write(base64.b64decode(data))

        # print('id: {}, name: {}, size: {}, type: {}, user_id: {}'.format(id, file_name, size, type,user_id))


        # conn = sqlite3.connect('dosya_veritabani.db')
        # cursor = conn.cursor()
        # cursor.execute("SELECT * FROM dosyalar ORDER BY id DESC LIMIT 1")
        # data = cursor.fetchone()
        # conn.close()
        # if data:
        #     print(data)
        #     print("Veri bulundu")
        #     # data_frame = to_dataframe(data)
        #     # tr_ai.train_ai(data_frame)


# import sqlite3
# import pandas as pd
# import base64
# import io
# import train_ai_model as tr_ai

# def verileri_oku(model_id,file_name, data,file_labelColumnName,file_problemType):
#     try:
#         data = to_dataframe(data)
#         tr_ai.train_ai(model_id,file_name, data,file_labelColumnName,file_problemType)
#     except Exception as e:
#         print("Hata:", str(e))

# def to_dataframe(data):
#     decoded_data = base64.b64decode(data[0])
#     csv_data = io.StringIO(decoded_data.decode('utf-8'))
#     data_frame = pd.read_csv(csv_data)
#     return data_frame


import sqlite3

# Tablo oluşturma
def create_table():
    conn = sqlite3.connect('dosya_veritabani.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS dosyalar (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            model_id TEXT,
            user_id INTEGER,
            file_name TEXT,
            data TEXT,
            type TEXT,
            size INTEGER,
            labelColumnName TEXT,
            problemType TEXT
        )
    ''')
    conn.commit()
    conn.close()

def add_data(model_id, user_id, file_name, data, file_type, file_size, labelColumnName, problemType):
    # Veritabanına veriyi ekleme
    conn = sqlite3.connect('dosya_veritabani.db')
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO dosyalar (model_id, user_id, file_name, data, type, size, labelColumnName, problemType)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (model_id, user_id, file_name, data, file_type, file_size, labelColumnName, problemType))
    conn.commit()
    conn.close()

# Tablo oluşturmayı çağırma
if __name__ == "__main__":
    create_table()