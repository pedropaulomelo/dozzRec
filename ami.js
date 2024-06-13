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

    if (evt.event === 'VarSet' && evt.calleridnum === evt.connectedlinenum && evt.variable.MIXMONITOR_FILENAME === '') {
        // console.log(evt)
        const callId = evt.uniqueid;
        const from = evt.calleridnum;
        const recordingPath = evt.value;
        recordingFiles[callId] = [recordingPath, false];
        console.log('OUT CALL START: ', callId, from );
    }

    if (evt.event === 'VarSet' && evt.calleridnum !== evt.connectedlinenum && evt.variable.MIXMONITOR_FILENAME === '') {
        // console.log(evt)
        const callId = evt.uniqueid;
        const from = evt.calleridnum;
        const recordingPath = evt.value;
        recordingFiles[callId] = [recordingPath, true];
        console.log('IN CALL START: ', callId, from );
    }

    if (evt.event === 'VarSet' && evt.variable.MIXMONITOR_FILENAME === '') {
        // console.log(evt)
        const callId = evt.uniqueid;
        const from = evt.calleridnum;
        const recordingPath = evt.value;
        recordingFiles[callId] = recordingPath;
        console.log('IN CALL START: ', callId, from );
    }

    if  (evt.event === 'BridgeLeave' && evt.bridgenumchannels === '0') {
        // console.log(evt)
        const from = evt.calleridnum;
        const to = evt.connectedlinenum;
        const callId = evt.linkedid;
        const recordingFile = recordingFiles[callId][0];
        const inCall = recordingFiles[callId][1];
        const logTxt = inCall ? 'IN CALL END: ' : 'OU CALL END: ';
        delete recordingFiles[callId];
        recordingFile && console.log(logTxt, callId, from, recordingFile);
        recordingFile &&  uploadToS3(recordingFile);
    }
});
