var express = require('express');
var router = express.Router();
var User = require('../models/user');
var sha256 = require('js-sha256').sha256;
var AccessToken = require('../models/token');

router.post('/', function(request, response, next) {
	response.setHeader('Content-Type', 'application/json');

	if (request.body.username && request.body.password) {
		User.findOne({ username: request.body.username})
			.then((res) => {
				if (res) {
					if (res.password == sha256(request.body.password)) {
						AccessToken.create(res).then((res) => {
							response.send(res);
						});
					}
					else {
						response.send({ error: 'Invalid password.' });
					}
				}
				else {
					response.send({ error: 'Invalid username.' });
				}
			});
	}
	else {
		response.send({ error: 'Invalid paramters.' });
	}
});

router.delete('/', function(req, res, next) {
  res.send('delete token');
});

module.exports = router;
