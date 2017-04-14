const MongoDb = require('./db'),
	ObjectID = require('mongodb').ObjectID,
	Q = require('q');

class MyModel {
	static get collection() {
		throw 'Not Implemented';
	}

	static create(data) {
		return this._create(data);
	}

	static findOne(data) {
		return this._findOne(data);
	}

	static find(data) {
		return this._find(data);
	}

	static _create(data) {
		return Q.promise((resolve, reject) => {
			MongoDb.connect().then((db) => {
				db.collection(this.collection).insertOne(data, function(err, res) {
					db.close();
					if (err) {
						reject(err);
					}
					else {
						resolve(data);
					}
				});
			}, (err) => {
				reject(err);
			});
		});
	}

	static _findOne(data) {
		data = data || { };

		if (data._id) {
			data._id = new ObjectID(data._id);
		}

		return Q.promise((resolve, reject) => {
			MongoDb.connect().then((db) => {
				db.collection(this.collection).findOne(data, (err, res) => {
					db.close();
					if (err) {
						reject(err);
					}
					else {
						resolve(res);
					}
				});
			}, (err) => {
				reject(err);
			});
		});
	}

	static _find(data) {
		data = data || { };

		if (data._id) {
			data._id = new ObjectID(data._id);
		}

		return Q.promise((resolve, reject) => {
			MongoDb.connect().then((db) => {
				let cursor = db.collection(this.collection).find(data);
				let result = []

				cursor.each(function(err, item) {
					if (err) {
						reject(err);
					}
					else {
						if (item) {
							result.push(item);
						}
						else {
							resolve(result);
						}
					}
				});
			});
		});
	}
}

module.exports = MyModel;
