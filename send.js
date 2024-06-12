const axios = require('axios');

exports.sendTranscription = async (callId, transcription) => {
    const response = await axios.post('https://api.dozz.com.br/calls/transcription', {callId, transcription});
    return response.data;
}
