from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/filepath', methods=['GET'])
def filepath():
    return jsonify({"message": "Processing the file"}), 200

if __name__ == '__main__':
    app.run(port=5010)