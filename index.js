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

// Função para verificar se o arquivo está pronto para leitura
function isFileReady(filePath) {
    // Tenta abrir o arquivo em modo de leitura
    try {
      const fd = fs.openSync(filePath, 'r');
      fs.closeSync(fd);
      return true;
    } catch (err) {
      return false;
    }
  }

  function monitorFileReady(filePath) {
    const checkInterval = setInterval(() => {
      if (isFileReady(filePath)) {
        clearInterval(checkInterval);
        console.log(`File Ready: ${filePath}`);
        uploadToS3(filePath);
      }
    }, 1000); // Verifica a cada 1 segundo
  }

// Monitorar a pasta de gravações
const watcher = chokidar.watch(pathToWatch, {
    ignored: /^\./,
    persistent: true,
    awaitWriteFinish: {
        stabilityThreshold: 5000, // Tempo em milissegundos para esperar após a última modificação
        pollInterval: 100         // Intervalo de polling em milissegundos
    },
    ignoreInitial: true
});

watcher
    .on('add', filePath => {
        console.log(`File added: ${filePath}`);
        monitorFileReady(filePath);
    })
    .on('error', error => console.log(`Watcher error: ${error}`));

console.log(`Watching for file changes in ${pathToWatch}`);