const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const HOST = '0.0.0.0'
const PORT = 5010;

app.get('/recording', (req, res) => {
    console.log('Request query: ', req.query);

    const { recordingPath } = req.query;

    if (!recordingPath) {
        return res.status(400).send('Parâmetros insuficientes');
    }

    fs.access(recordingPath, fs.constants.F_OK, (err) => {
        if (err) {
            console.log(err);
            return res.status(404).send('Arquivo não encontrado');
        }

        res.sendFile(recordingPath);
    });
});

app.listen(PORT, HOST, () => {
    console.log(`Calls Recording server running on port ${PORT}`);
});