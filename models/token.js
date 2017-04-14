const MyModel = require('./mymodel'),
	uuid = require('node-uuid'),
	User = require('./user');

class Token extends MyModel {
	static get collection() {
		return 'accessTokens';
	}

	static create(data) {
		let token = {
			userId: data._id,
			token: uuid.v4()
		}

		return this._create(token);
	}

	static findOne(data) {
		return this._findOne({ token : data });
	}
}

module.exports = Token;
