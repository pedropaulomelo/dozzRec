const AWS = require('aws-sdk');
const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const { sendAudioFile } = require('./sendnode');

// Configurar as credenciais da AWS
AWS.config.update({
    accessKeyId: process.env.BUCKET_ACCESS_KEY,
    secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY,
    region: process.env.BUCKET_REGION
});

const s3 = new AWS.S3();
const bucketName = process.env.BUCKET_NAME;
const pathToWatch = '/var/spool/asterisk/monitor';
const uploadDelay = 60000; // 1 minuto de atraso após a última modificação

// Função para fazer upload dos arquivos para o S3
const uploadToS3 = (filePath) => {
    const fileName = path.basename(filePath);
    const fileStream = fs.createReadStream(filePath);

    const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: fileStream
    };

    s3.upload(params, async (err, data) => {
        if (err) {
            console.log(`Failed to upload ${fileName}:`, err);
        } else {
            console.log(`Uploaded ${fileName} to ${bucketName}`);
            const response = await sendAudioFile(filePath);
            console.log('TRANSCRIPTION: ', response);
        }
    });
};

// Monitorar a pasta de gravações
const watcher = chokidar.watch(pathToWatch, {
    persistent: true,
    ignoreInitial: true
});

const fileTimers = new Map();

watcher
    .on('add', filePath => {
        console.log(`File added: ${filePath}`);
        if (fileTimers.has(filePath)) {
            clearTimeout(fileTimers.get(filePath));
        }
        fileTimers.set(filePath, setTimeout(() => uploadToS3(filePath), uploadDelay));
    })
    .on('change', filePath => {
        console.log(`File changed: ${filePath}`);
        if (fileTimers.has(filePath)) {
            clearTimeout(fileTimers.get(filePath));
        }
        fileTimers.set(filePath, setTimeout(() => uploadToS3(filePath), uploadDelay));
    })
    .on('error', error => console.log(`Watcher error: ${error}`));

console.log(`Watching for file changes in ${pathToWatch}`);