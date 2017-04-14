const AccessToken = require('../models/token'),
	User = require('../models/user');

function authenticate(request, response, next) {
	if (request.headers.authorization) {
		let token = request.headers.authorization.replace('Basic', '').trim();
		AccessToken.findOne(token).then((res) => {
			if (res) {
				User.findOne({ _id: res.userId }).then((res) => {
					request.user = res;
					next();
				});
			} else {
				response.send({ error : 'Invalid token.' });
			}
		});
	}
	else {
		response.send({ error : 'Token is required.' });
	}
}

module.exports = authenticate;
