const ami = require('asterisk-manager');
const { uploadToS3 } = require('./upload');

// Configuração de conexão

const ip = '18.230.133.246';
// const ip = '127.0.0.1';
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

    if (evt.event === 'VarSet' && evt.variable.MIXMONITOR_FILENAME === '' ) {
        // console.log(evt)
        const callId = evt.uniqueid;
        const from = evt.calleridnum;
        const recordingPath = evt.value;
        const inCall = evt.priority === '3';
        const logTxt = inCall ? 'IN CALL START: ' : 'OUT CALL START: ';
        recordingFiles[callId] = [recordingPath, inCall];
        console.log(logTxt, callId, from );
    }

    if  (evt.event === 'BridgeLeave' && evt.bridgenumchannels === '0') {
        // console.log(evt)
        const from = evt.calleridnum;
        const to = evt.connectedlinenum;
        const callId = evt.linkedid;
        const data = recordingFiles[callId];
        const recordingFile = data?.[0];
        const inCall = data?.[1];
        const logTxt = inCall ? 'IN CALL END: ' : 'OUT CALL END: ';
        delete recordingFiles[callId];
        recordingFile && console.log(logTxt, callId, from, recordingFile);
        recordingFile &&  uploadToS3(inCall, recordingFile);
    }
});
