const MyModel = require('./mymodel'),
	sha256 = require('js-sha256').sha256;


class User extends MyModel {
	static get collection() {
		return 'users';
	}

	static create(data) {
		let user = {
			username: data.username,
			password: sha256(data.password)
		}

		return this._create(user);
	}

	static findOne(data) {
		if (data.password) {
			data.password = sha256(data.password);
		}

		return this._findOne(data);
	}
}

module.exports = User;
