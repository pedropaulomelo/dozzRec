const AWS = require('aws-sdk');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const { sendAudioFile } = require('./sendnode');
const { sendTranscription } = require('./send');

// Configurar as credenciais da AWS
AWS.config.update({
    accessKeyId: process.env.BUCKET_ACCESS_KEY,
    secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY,
    region: process.env.BUCKET_REGION
});

const s3 = new AWS.S3();
const bucketName = process.env.BUCKET_NAME;

// Função para fazer upload dos arquivos para o S3
exports.uploadToS3 = (inCall, filePath) => {
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
            const response = await sendAudioFile(filePath);
            const callId = fileName.split('-').pop().split('.wav')[0];
            const transcResponse = await sendTranscription(inCall, callId, response);
        }
    });
};

// exports.uploadToS3 = async (inCall, filePath) => {
//     const response = await sendAudioFile(filePath);
//     const fileName = path.basename(filePath);
//     const callId = fileName.split('-').pop().split('.wav')[0];
//     const transcResponse = await sendTranscription(inCall, callId, response);
//     console.log('AI ANALISYS: ', transcResponse);
// }
