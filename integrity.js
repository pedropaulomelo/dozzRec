const express = require('express');
const app = express();
const PORT = 3007;

app.get('/', (req, res) => {
  console.log('Health Check');
  res.status(200).send('OK');
});

app.listen(PORT, () => {
  console.log(`Integrity Server running on port ${PORT}`);
});
