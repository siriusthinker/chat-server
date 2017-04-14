const MyModel = require('./mymodel');


class Message extends MyModel {
	static get collection() {
		return 'messages';
	}

	static create(data) {
		let message = {
			userId: data.user._id,
			body: data.body,
			time: new Date()
		}

		return this._create(message);
	}
}

module.exports = Message;
