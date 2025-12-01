const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const registerController = async (req, res) => {
	try {
		if (!req.body)
			throw new Error(
				'JSON body required containing: firstName, lastName, email, password'
			);

		const { firstName, lastName, email, password } = req.body;
		const user = new User({ firstName, lastName, email, password });
		await user.save();
		res.status(201).json({
			message: 'New user registered',
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
		});
	} catch (err) {
		err.status = 400;
		throw err;
	}
};

const loginController = async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });
	if (!user) {
		const error = new Error('Email or password is invalid');
		error.status = 401;
		throw error;
	}

	const match = await bcrypt.compare(password, user.password);

	if (!match) {
		const error = new Error('Email or password is invalid');
		error.status = 401;
		throw error;
	}

	const token = jwt.sign(
		{
			id: user._id,
			firstName: user.firstName,
			lastName: user.lastName,
		},
		process.env.JWT_KEY,
		{
			expiresIn: '1h',
		}
	);

	res.cookie('token', token, {
		httpOnly: true,
		sameSite: 'strict',
		maxAge: 60 * 60 * 1000, // 1 hour, matches token expiry
	});
	res.json({
		message: 'Login ok',
	});
};

module.exports = { registerController, loginController };
