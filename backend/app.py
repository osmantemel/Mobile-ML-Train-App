from flask import Flask, request, jsonify
import ai
import database as db


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

        db.add_data(model_id,user_id, file_name, data, file_type, file_size)
        ai.verileri_oku()
        return jsonify({'mesaj ': 'Dosya alındı ve işlendi.'}), 200
    except Exception as e:
        print("Hata:", str(e))
        return jsonify({'error': f'Hata: {str(e)}'}), 500

if __name__ == '__main__':
    db.create_table()
    app.run(debug=True)
