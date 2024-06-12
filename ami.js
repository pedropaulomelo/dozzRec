const ami = require('asterisk-manager');
const { uploadToS3 } = require('./upload');

// Configuração de conexão

const ip = '127.0.0.1';
// const ip = 'portermaringa.dyndns.org';
const port = 5038;  // Porta padrão do AMI
const user = 'dozz';
const secret = 'SgAlbCahwTDaxJtonP5X6QgD9olWIdPT';
 
const amiConnection = new ami(port, ip, user, secret, true);

console.log('Cloud Voice AMI connection started');

const recordingFiles = {};

amiConnection.on('response', (res) => {
    console.error('Connection:', res);
});

amiConnection.on('managerevent', (evt) => {
    // console.log(evt)

    if (evt.event === 'VarSet' && evt.variable.MIXMONITOR_FILENAME === '') {
        // console.log(evt)
        const callId = evt.uniqueid;
        const recordingPath = evt.value;
        recordingFiles[callId] = recordingPath;
        console.log('CALL START: ', callId, 'FROM: ', from, 'TO: ', to );
    }

    if  (evt.event === 'BridgeLeave' && evt.bridgenumchannels === '0' && evt.context === 'macro-dial-one') {
        // console.log(evt)
        const from = evt.calleridnum;
        const to = evt.connectedlinenum;
        const callId = evt.linkedid;

        // console.log(`Ligação de ${from} para ${to} foi encerrada - ID: ${callId}`);
        console.log('CALL END: ', callId, 'FROM: ', from, 'TO: ', to);

        const recordingFile = recordingFiles[callId];

        console.log('RECORDING FILE: ', recordingFile)
        delete recordingFiles[callId];

        // console.log('Sending the filePath to the voice server: ', recordingFile)
        recordingFile &&  uploadToS3(recordingFile);
    }
});
