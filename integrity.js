const express = require('express');
const cors = require('cors');

const app = express();
const port = 5011;

app.use(cors({ origin: '*', credentials: true }));

app.get('/', (req, res) => {
    console.log('Integrity')
    res.status(200).json('OK')
});

app.listen(port, () => {
    console.log(`Integrity server running on port ${port}`);
});