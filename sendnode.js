const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// URL do endpoint do servidor Flask
const url = 'https://8281e92c1458.ngrok.app/transcribe';

// Caminho do arquivo de áudio
const filePath = '/Users/dozz/Downloads/q-150-5031-20240611-171657-1718137017.2015830.wav';

// Função para enviar o arquivo de áudio
exports.sendAudioFile = async (filePath) => {
    const form = new FormData();
    form.append('audio', fs.createReadStream(filePath));

    try {
        const response = await axios.post(url, form, {
            headers: form.getHeaders()
        });
        console.log(response.data);
        // return response.data
    } catch (error) {
        console.error('Erro ao enviar arquivo:', error.message);
    }
}

// Enviar o arquivo e obter a resposta
sendAudioFile(filePath);