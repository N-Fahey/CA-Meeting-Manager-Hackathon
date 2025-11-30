// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
	// Get status from error, or default to 500
	const status = err.status || 500;

	if (status === 500) {
		console.error(err.stack || err);
	}

	res.status(status).json({
		message: 'An error occured',
		error: err.message || 'Unknown server error',
		errorName: err.name,
	});
};

const unknownRouteHandler = (req, res) => {
	res.status(400).json({
		message: 'No route with that path found',
		attemptedPath: req.path,
	});
};

module.exports = { errorHandler, unknownRouteHandler }