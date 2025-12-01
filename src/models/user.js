const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
	{
		firstName: {
			type: String,
			required: [true, 'First name is required'],
		},
		lastName: {
			type: String,
			required: [true, 'Last name is required'],
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: [true, 'Email must be unique'],
			validate: {
				validator: validator.isEmail,
				message: 'Please enter a valid email address',
			},
			// regex / builtin
			// match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
		},
		password: {
			type: String,
			required: [true, 'Password is required'],
			minLength: [4, 'Password must be at least 4 characters'],
		},
	},
	{ timestamps: true }
);

userSchema.pre('save', async function () {
	// Only hash if new / changed password
	// Note: update user routes not implemented, so this should not be required
	if (!this.isModified('password')) return;
	this.password = await bcrypt.hash(this.password, 10);
	// TODO: normalise name, email fields
});

module.exports = mongoose.model('User', userSchema);
