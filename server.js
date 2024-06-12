const express = require('express');
const app = express();
const host = '0.0.0.0'
const port = 5010;

app.get('/filepath/:filePath', (req, res) => {
    const { filePath } = req.params;
    console.log('filePath: ', filePath)
  res.status(200).json({ message: 'Processing the file' });
});

app.listen(port, host, () => {
  console.log(`Server is listening on port ${port}`);
});