from flask import Flask, request, jsonify
import ai
import database as db
import sqlite3


app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload():
    try:
        file_data = request.json
        model_id = file_data.get('id')
        user_id = file_data.get('user_id')
        file_name = file_data.get('name')
        data = file_data.get('data')
        file_type = file_data.get('type')
        file_size = file_data.get('size')
        file_problemType = file_data.get('problemType')
        file_labelColumnName = file_data.get('labelColumnName')

        db.add_data(model_id, user_id, file_name, data, file_type, file_size, file_labelColumnName, file_problemType)
        ai.verileri_oku(model_id, file_name, file_labelColumnName, file_problemType)
        return jsonify({'message': 'Dosya alındı ve işlendi.'}), 200
    except Exception as e:
        print("Hata:", str(e))
        return jsonify({'error': f'Hata: {str(e)}'}), 500

@app.route('/response', methods=['GET'])
def response():
    try:
        conn = sqlite3.connect('dosya_veritabani.db')
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM model")
        rows = cursor.fetchall()
        conn.close()

        return jsonify(rows), 200
    except Exception as e:
        print("Hata:", str(e))
        return jsonify({'error': f'Hata: {str(e)}'}), 500

# model tablosundaki model_id elemanını dönen endpoint
@app.route('/response/model_id/<model_id>', methods=['GET'])
def response_model_id(model_id):
    try:
        print(model_id)
        conn = sqlite3.connect('dosya_veritabani.db')
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM model WHERE id = ?", (model_id))
        row = cursor.fetchall()
        print(row)
        conn.close()

        return jsonify(row), 200
    except Exception as e:
        print("Hata:", str(e))
        return jsonify({'error': f'Hata: {str(e)}'}), 500



if __name__ == '__main__':
    db.create_table()
    app.run(debug=True)
