// include needed models
const AccessToken = require('../models/token'),
	User = require('../models/user'),
	Message = require('../models/message'),
	Q = require('q');

class Sockets {
	constructor(io, socket) {
		this.io = io;
		this.socket = socket;

        // checks if token passed is a valid token
        // when token is valid, insert new message
        // in the database
		this.tokenIsValid().then((res) => {
			if (res) {
				this.user = res;
				this.socket.on('message', (message) =>  { this.messageReceived(message); });
				this.socket.on('get messages', () => { this.getMessages(); });

			}
		});
	}

    // validates the token passed
    // to the socket server
	tokenIsValid() {
		return Q.promise((resolve, reject) => {
			if (this.socket.handshake.query.token) {
				AccessToken.findOne(this.socket.handshake.query.token).then((res) => {
					if (res) {
						User.findOne({ _id: res.userId }).then((res) => {
							resolve(res);
						});
					} else {
						reject();
					}
				});
			}
		});
	}

    // creates new message entry in the database
    // and emits back to the client
	messageReceived(message) {
		Message.create({
			user: this.user,
			body: message
		}).then((res) => {
			res.user = this.user;
			this.io.emit('message', res);
		});
	}

    // get all messages and emit back to the client
	getMessages() {
		Message.find().then((res) => {
			let messages = res;
			let promises = [];

			for(let i=0;i < messages.length;i++) {
				promises.push(User.findOne({ _id : messages[i].userId }));
			}

			Q.all(promises).then((res) => {
				for(let i=0;i<messages.length;i++) {
					messages[i].user = res[i];
				}

				this.socket.emit('message', messages);
			});
		});
	}
}

module.exports = Sockets;
