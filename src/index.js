const express = require('express');

const app = express();
app.use(express.json());

// Security
const helmet = require('helmet');
const cors = require('cors');

app.use(helmet());
app.use(
	cors({
		origin: ['http://127.0.0.1:5000'],
		optionsSuccessStatus: 200,
	})
);

// Root Route
app.get('/', (req, res) => {
	res.json({ status: 'Ok' });
});

module.exports = { app };
