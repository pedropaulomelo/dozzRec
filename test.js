const path = require('path');
const fs = require('fs');

const recordingDir = '/Users/dozz/Documents/';

const callId = '1717553778';

fs.readdir(recordingDir, (err, files) => {
    if (err) {
        console.log('Erro ao ler o diretório');
        console.log(err)
    }

    // Procura o arquivo de gravação que contém o callId
    const recordingFile = files.find(file => file.includes(callId));

    if (!recordingFile) {
        console.log('Arquivo não encontrado');
    }

    const recordingPath = path.join(recordingDir, recordingFile);
    
    console.log('Caminho completo: ', recordingPath);
});