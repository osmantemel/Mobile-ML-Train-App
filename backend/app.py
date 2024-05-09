from flask import Flask, request, jsonify
import base64

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload_file():
    file_data = request.json

    name = file_data.get('name')
    data = file_data.get('data')
    file_type = file_data.get('type')
    file_size = file_data.get('size')

    decoded_data = base64.b64decode(data)

    return jsonify({'message': 'Dosya alındı ve işlendi.'}), 200

if __name__ == '__main__':
    app.run(debug=True)
