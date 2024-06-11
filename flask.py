from flask import Flask, request, send_file, jsonify
import os

app = Flask(__name__)
port = 5010
host = '0.0.0.0'  # Para garantir que o servidor escute em todos os endereços IPv4

@app.route('/recording', methods=['GET'])
def get_recording():
    recording_path = request.args.get('recordingPath')
    
    if not recording_path:
        return jsonify(message='Parâmetros insuficientes'), 400

    if not os.path.exists(recording_path):
        return jsonify(message='Arquivo não encontrado'), 404

    return send_file(recording_path)

if __name__ == '__main__':
    app.run(host=host, port=port)