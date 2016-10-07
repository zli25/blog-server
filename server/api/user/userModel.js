var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
	username: {
		type: String,
		require: true,
		unique: true
	},

	password: {
		type: String,
		require: true,
		trim: true,
    validate: [function(v) {return v.length >= 8;}, 'Password must be at least 8 digits.']
	}
});

UserSchema.pre('save', function(next) {
	if (!this.isModified('password')) {
		return next();
	}
	this.password = this.encryptPassword(this.password);
	next();
});

UserSchema.methods = {

	// check the password on signin
	authenticate: function(plainTextpwd) {
		return bcrypt.compareSync(plainTextpwd, this.password);
	},

	// hash the password
	encryptPassword: function(plainTextpwd) {
		if (!plainTextpwd) {
			return '';
		} else {
			var salt = bcrypt.genSaltSync(10);
			return bcrypt.hashSync(plainTextpwd, salt);
		}
	},

	toJson: function() {
		var obj = this.toObject();
		delete obj.password;
		return obj;
	}
}

module.exports = mongoose.model('User', UserSchema);
