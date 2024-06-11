const AWS = require('aws-sdk');
const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Configurar as credenciais da AWS
AWS.config.update({
    accessKeyId: process.env.BUCKET_ACCESS_KEY,
    secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY,
    region: process.env.BUCKET_REGION
});

const s3 = new AWS.S3();
const bucketName = process.env.BUCKET_NAME;
const pathToWatch = '/var/spool/asterisk/monitor';

// Função para fazer upload dos arquivos para o S3
const uploadToS3 = (filePath) => {
    const fileName = path.basename(filePath);
    const fileStream = fs.createReadStream(filePath);
    
    const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: fileStream
    };

    s3.upload(params, (err, data) => {
        if (err) {
            console.log(`Failed to upload ${fileName}:`, err);
        } else {
            console.log(`Uploaded ${fileName} to ${bucketName}`);
        }
    });
};

// Verificar se o arquivo terminou de ser escrito
const waitForFile = (filePath, callback) => {
    let lastSize = 0;
    let checkInterval = setInterval(() => {
        fs.stat(filePath, (err, stats) => {
            if (err) {
                clearInterval(checkInterval);
                console.log(`Failed to stat file ${filePath}:`, err);
                return;
            }

            if (stats.size === lastSize) {
                clearInterval(checkInterval);
                callback(filePath);
            } else {
                lastSize = stats.size;
            }
        });
    }, 1000); // Checar a cada segundo
};

// Monitorar a pasta de gravações
const watcher = chokidar.watch(pathToWatch, {
    persistent: true,
    ignoreInitial: true
});

watcher
    .on('add', filePath => {
        console.log(`File added: ${filePath}`);
        waitForFile(filePath, uploadToS3);
    })
    .on('error', error => console.log(`Watcher error: ${error}`));

console.log(`Watching for file changes in ${pathToWatch}`);