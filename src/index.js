const express = require('express');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ status: 'Ok' });
});

module.exports = { app }