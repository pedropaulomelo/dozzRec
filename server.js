const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const integrity = require('./integrity');

const app = express();
const port = 5011;

app.use(cors({ origin: '*', credentials: true }));
// app.use(cors({ origin: [ `https://dash.dozz.com.br` ], credentials: true }));

app.get('/recording', (req, res) => {
    console.log('Request params: ', req.params)
    res.json('Hello')
    // const { recordingPath } = req.params;

    // if (!recordingPath) {
    //     return res.status(400).send('Parâmetros insuficientes');
    // }
    // console.log(req.params)
    // // Garante que o caminho é absoluto
    // const resolvedPath = path.resolve(recordingPath);

    // // Verifica se o arquivo existe
    // fs.access(resolvedPath, fs.constants.F_OK, (err) => {
    //     if (err) {
    //         console.log(err);
    //         return res.status(404).send('Arquivo não encontrado');
    //     }

    //     // Envia o arquivo
    //     res.sendFile(resolvedPath);
    // });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});