const express = require('express');
const cors = require('cors');

const app = express();
const port = 5010;

app.use(cors({ origin: '*', credentials: true }));

app.get('/integrity', (req, res) => {
    console.log('Integrity')
    res.status(200)
});

app.listen(port, () => {
    console.log(`Integrity server running on port ${port}`);
});