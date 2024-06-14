const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// URL do endpoint do servidor Flask
const url = 'https://dozz.ngrok.app/transcribe';


// Função para enviar o arquivo de áudio
exports.sendAudioFile = async (filePath) => {
    // console.log('FILE_PATH: ', filePath)
    const form = new FormData();
    form.append('audio', fs.createReadStream(filePath));

    try {
        console.log('CALLING TRANSCRIBER')
        const response = await axios.post(url, form, {
            headers: form.getHeaders()
        });
        console.log(response.data);
        return response.data
    } catch (error) {
        console.error('Erro ao enviar arquivo:', error.message);
    }
}
