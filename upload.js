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
exports.uploadToS3 = (filePath) => {
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
        } else {1
            console.log(`Uploaded ${fileName} to ${bucketName}`);
            const response = await sendAudioFile(filePath);
            console.log('TRANSCRIPTION: ', response);
            const callId = recordingPath.split('-').pop();
            const transcResponse = await sendTranscription(callId, response);
            console.log('SEND TRANSCRIPTION RESPONSE: ', transcResponse);
        }
    });
};
