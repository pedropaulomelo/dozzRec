import requests

# URL do endpoint do servidor Flask
url = "https://65d726f3dfeb.ngrok.app/transcribe"

# Caminho do arquivo de áudio
file_path = "/Users/dozz/Downloads/out-109001001-1009-20240611-171233-1718136752.2015612.wav"

# Função para enviar o arquivo de áudio
def send_audio_file(file_path):
    with open(file_path, 'rb') as audio_file:
        files = {'audio': audio_file}
        response = requests.post(url, files=files)
        return response.json()

# Enviar o arquivo e obter a resposta
response = send_audio_file(file_path)
print(response)