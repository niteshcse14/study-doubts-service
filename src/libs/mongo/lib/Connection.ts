import mongoose from "mongoose";

declare var config: any;
export default class Connection {
    _connections: any;
	constructor(mongo_url, callback: any) {
		this._connections = {};
		this.connect(mongo_url, callback);
	}

	/**
	 * connect : connecting with mongo-db
	 *
	 * @author Nitesh <nitesh.nituk14@gmail.com>
	 *
	 * @param mongo_url string
	 * @param callback object
	 */

	public connect(mongo_url, callback: any): void {
		if (!mongo_url) throw new Error(config.mongo.URL_NOT_FOUND);
		if (this._connections[mongo_url]) return callback(null, this._connections[mongo_url], mongoose);
		mongoose.connect(mongo_url, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });
		let db = mongoose.connection;
		db.on(config.mongo.keys.error, err => {
			throw err;
		});
		db.once(config.mongo.keys.open, () => {
			this._connections[mongo_url] = db;
			callback(null, this._connections[mongo_url], mongoose);
		});
	}
}
