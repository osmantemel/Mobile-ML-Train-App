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

    # form_values tablosu oluşturma
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS form_values (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        model_id INTEGER,
        parametreler TEXT,
        form_values TEXT,  -- values yerine form_values kullanıldı
        FOREIGN KEY (model_id) REFERENCES model (id)
    )
    ''')

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
