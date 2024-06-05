const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5010;

// Diretorio base onde estão salvas as gravações
const recordingsBaseDir = '/var/spool/asterisk/monitor'; 

app.get('/recording', (req, res) => {
    const { year, month, day, callId } = req.query;

    if (!year || !month || !day || !callId) {
        return res.status(400).send('Parâmetros insuficientes');
    }

    // Constrói o caminho completo para o arquivo de gravação
    const recordingDir = path.join(recordingsBaseDir, year, month, day);
    fs.readdir(recordingDir, (err, files) => {
        if (err) {
            return res.status(500).send('Erro ao ler o diretório');
        }

        // Procura o arquivo de gravação que contém o callId
        const recordingFile = files.find(file => file.includes(callId));

        if (!recordingFile) {
            return res.status(404).send('Arquivo não encontrado');
        }

        const recordingPath = path.join(recordingDir, recordingFile);
        res.sendFile(recordingPath);
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});