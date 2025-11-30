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

// Routers
const authRouter = require('./routes/auth');
app.use('/api/v1/auth', authRouter);

// Root Route
app.get('/', (req, res) => {
	res.json({ status: 'Ok' });
});

// Error Handling
const { errorHandler, unknownRouteHandler } = require('./utils/errorHandler');
app.use(unknownRouteHandler);
app.use(errorHandler);

module.exports = { app };
