const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
	//Get token cookie
	const token = req.cookies.token;

	if (!token) {
		const error = new Error('Missing auth token');
		error.status = 401;
		return next(error);
	}

	try {
		req.user = jwt.verify(token, process.env.JWT_KEY);
		next();
	} catch (err) {
		err.status = 401;
		next(err);
	}
};

module.exports = { authMiddleware };
