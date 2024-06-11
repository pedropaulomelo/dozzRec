const express = require('express');
const app = express();
const HOST = '0.0.0.0'
const PORT = 5011;

app.get('/', (req, res) => {
  console.log('Health Check');
  res.status(200).send('OK');
});

app.listen(PORT, HOST, () => {
  console.log(`Integrity Server running on port ${PORT}`);
});
