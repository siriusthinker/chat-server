const MongoClient = require('mongodb').MongoClient,
	Q = require('q');

class MongoDb {
	static connect() {
		let url = 'mongodb://mysimplechatapp:mysimplechatapp@ds111549.mlab.com:11549/mysimplechatapp';

		return Q.Promise((resolve, reject) => {
			MongoClient.connect(url, function(err, db) {
				if (err) {
					reject(err);
				}
				else {
					resolve(db);
				}
			});
		});
	}
}

module.exports = MongoDb;
