const axios = require('axios');

exports.sendTranscription = async (inCall, callId, transcription) => {
    // const response = await axios.post('http://localhost:5000/calls/transcription', {inCall, callId, transcription});
    const response = await axios.post('https://api.dozz.com.br/calls/transcription', {inCall, callId, transcription});
    return response.data;
}
