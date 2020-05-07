import events from "events";

declare var services: any, config: any;
export default class Events extends events.EventEmitter {
	constructor() {
		super({ captureRejections: true });
		console.log("initialized event emitter...");
		this.initialize();
	}

	initialize() {
		this._addListener(config.FIELDS.GET, services.collection.find);
		this._addListener(config.FIELDS.PATCH, services.collection.update);
		this._addListener(config.FIELDS.POST, services.collection.insert);
		this._addListener(config.FIELDS.UNDO, services.collection.undo);
		this._addListener(config.FIELDS.DELETE, services.collection.delete);
		this._addListener(config.FIELDS._DELETE, services.collection._delete);
		this._addListener(config.FIELDS.PUT, services.collection.replaceOne);
	}

	_count(listener_name) {
		return events.EventEmitter.listenerCount(this, listener_name);
	}

	_emit(listener_name) {
		return this.emit(listener_name);
	}

	_addListener(event, listener) {
		this.addListener(event, listener);
	}

	_listeners(listener_name) {
		return this.listeners(listener_name);
	}

	_removeListener(event, listener) {
		return this.removeListener(event, listener);
	}

	_once(event, listener) {
		return this.once(event, listener);
	}

	_on(event, listener) {
		return this.on(event, listener);
	}

	_removeAllListeners(listener_name) {
		return this.removeAllListeners(listener_name);
	}

	set _setMaxListeners(events_count) {
		this.setMaxListeners = events_count;
	}

	[events.captureRejectionSymbol](err, event, ...args) {
		this.destroy(err);
	}

	destroy(err) {
		throw err;
	}
}
