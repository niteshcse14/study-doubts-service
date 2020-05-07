import redis from "redis";

declare var config: any;
export default class Redis {
	client: any;
	redis_is_ready: Boolean = false;
	constructor() {
		this.client = redis.createClient(config.REDIS_PORT, config.REDIS_HOST);
		const _self = this;

		this.client.on("error", function (err) {
			_self.redis_is_ready = false;
			throw err;
		});

		this.client.on('ready', function() {
			console.log("redis ready to listen events...");
		});

		this.client.on("connect", function () {
			_self.redis_is_ready = true;
		});
	}

	get status() {
		return this.redis_is_ready;
	}

	set(key, value) {
		if (this.redis_is_ready) {
			this.client.set(key, value);
		} else {
			throw ("redis is not running - sessions won't be written to disk");
		}
	}

	get(key) {
		if (this.redis_is_ready) {
			return this.client.get(key);
		} else {
			throw ("redis is not running - sessions won't be written to disk");
		}
	}

	exists(key) {
		return this.client.exists(key);
	}

	del(key) {
		return this.client.del(key);
	}
}
