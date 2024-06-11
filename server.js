const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const integrity = require('./integrity');

const app = express();
const port = 3007;

app.use(cors({ origin: '*', credentials: true }));
// app.use(cors({ origin: [ `https://dash.dozz.com.br` ], credentials: true }));

app.get('/recording', (req, res) => {
    console.log('Request query: ', req.query);

    const { recordingPath } = req.query;

    if (!recordingPath) {
        return res.status(400).send('Parâmetros insuficientes');
    }

    // Verifica se o arquivo existe diretamente no caminho fornecido
    fs.access(recordingPath, fs.constants.F_OK, (err) => {
        if (err) {
            console.log(err);
            return res.status(404).send('Arquivo não encontrado');
        }

        // Envia o arquivo
        res.sendFile(recordingPath);
    });
});

app.listen(port, () => {
    console.log(`Calls Recording server running on port ${port}`);
});