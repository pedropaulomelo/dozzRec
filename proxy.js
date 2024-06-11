const express = require('express');
const axios = require('axios');
const integrity = require('./integrity');

const app = express();
const HOST = '0.0.0.0';
const PORT = 5010;

app.get('/recording', async (req, res) => {
  const { recordingPath } = req.query;

  if (!recordingPath) {
    return res.status(400).send('Parâmetros insuficientes'); 
  }

  try {
    const response = await axios.get(`http://18.230.133.246:5010/recording?recordingPath=${recordingPath}`);
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao encaminhar a requisição');
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Forwarding server running on port ${PORT}`);
});