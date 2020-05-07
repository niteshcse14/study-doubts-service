import { EventEmitter } from "events";
import { series } from 'async';
import path from 'path';
import fs from 'fs';
import AppConfig from "../../config/App";
import Seeder from "seeder";


/**
 * Main class binding all events and initializing applications.
 */

declare var config: any, middleware: any, event: any, services: any;
export default class Main extends AppConfig {
	_config: any;
	_args: string[];
	constructor(admin_config: any) {
		super();
		this._config = admin_config;
		EventEmitter.prototype.setMaxListeners(admin_config.max_events || 20);
		const tasks = [this.initializeConfig.bind(this), this.loadServices.bind(this), this.initializeModels.bind(this)];
		this._args = process.argv.slice(2);
		if (this._args[0] !== "seed" || !this._args.length) tasks.push(...[this.initializeMiddleware.bind(this), this.initEventEmitter.bind(this)]);
		tasks.push(this.initializeApplication.bind(this));
		series(tasks, admin_config.callback);
	}

	/**
	 * Description: creating singleton config instance of all config's.
	 * @param callback
	 */
	initializeConfig(callback) {
		try {
			this.addSafeReadOnlyGlobal('config', this.dfsUtil("config", true));
			callback(null, config);
		} catch (err) {
			callback(err);
		}
	}

	/**
	 * Description: creating singleton service instance of all service's.
	 * @param callback
	 */
	loadServices(callback) {
		let services = {};
		try {
			let list = fs.readdirSync(path.join(this.app_base_dir, config.FIELDS.SERVICES));
			list.forEach(item => {
				if (item.search(/.map$/) === -1 && item.search(/.[tj]s$/) !== -1) {
					let name = item.toString().replace(/\.[tj]s$/, '');
					services[this.functionNameToVariableName(name)] = new (require(path.join(this.app_base_dir, config.FIELDS.SERVICES, name)).default);
				}
			});
			this.addSafeReadOnlyGlobal(config.FIELDS.SERVICES, services);
			callback(null, services);
		} catch (err) {
			callback(err);
		}
	}

	/**
	 * Description: creating singleton event instance of all event's.
	 * @param callback
	 */
	initEventEmitter(callback) {
		try {
			this.addSafeReadOnlyGlobal(config.FIELDS.EVENT, new (require(path.join(this.app_base_dir, config.FIELDS.EVENTS)).default));
			callback(null, event);
		} catch (err) {
			callback(err);
		}
	}

	/**
	 * Description: creating singleton _db instance of all model's.
	 * @param callback
	 */
	initializeModels(callback) {
		try {
			config.MODELS = {};
			let list = fs.readdirSync(path.join(this.app_base_dir, (this._config.model || config.FIELDS.MODELS).toString())),
				db = {}, i = 0, prod_flag = 1;
			list.forEach(item => {
				if (item.search(/.map$/) === -1 && item.search(/.[tj]s$/) !== -1) {
					let name = item.toString().replace(/\.[tj]s$/, '');
					(require(path.join(this.app_base_dir, config.FIELDS.MODELS, item)).default).initialize(this.DATABASE_URL, (err, model) => {
						if (err) return callback(err);
						++i;
						const model_name = this.functionNameToVariableName(name);
						config.MODELS[model_name.toUpperCase()] = model_name;
						db[model_name] = model;
						if (i ===  list.length / prod_flag) {
							this.addSafeReadOnlyGlobal(config.FIELDS._DB, db);
							callback(null, db);
						}
					});
				} else if (item.search(/.map$/) !== -1) prod_flag = 2;
			});
		} catch (e) {
			callback(e);
		}
	}

	/**
	 * Description: traversing top to bottom and generating full valid path for file.
	 * @param root
	 * @param single
	 * @param parent
	 */
	dfsUtil(root, single = false, parent = "") {
		let obj = {};
		try {
			let arr = fs.readdirSync(path.join(this.app_base_dir, root)) || [];
			for (let i = 0; i < arr.length; ++i) {
				if (arr[i].search(/.map$/) === -1 && arr[i].search(/.[tj]s$/) !== -1) {
					let name = arr[i].toString().replace(/\.[tj]s$/, '');
					if (single) {
						const _class = new (require(path.join(this.app_base_dir, root, name)).default), keys = Object.getOwnPropertyNames(Object.getPrototypeOf(_class));
						obj = { ...obj, ..._class };
						for (let j = 0; j < keys.length; ++j) obj[keys[j]] = _class[keys[j]];
					}
					else obj[this.functionNameToVariableName(name)] = require(path.join(this.app_base_dir, root, name)).default;
				}
				else if (arr[i] !== "base") {
					if (single) obj = { ...obj, ...this.dfsUtil(root + "/" + arr[i], single, arr[i]) };
					else obj[this.functionNameToVariableName(arr[i])] = this.dfsUtil(root + "/" + arr[i], single, arr[i]);
				}
			}
			return obj;
		} catch (err) {
			return obj;
		}
	}

	/**
	 * Description: creating singleton middleware instance of all middleware's.
	 * @param callback
	 */
	initializeMiddleware(callback) {
		try {
			this.addSafeReadOnlyGlobal(config.FIELDS.MIDDLEWARE, this.dfsUtil(config.FIELDS.MIDDLEWARE));
			callback(null, middleware);
		} catch (err) {
			callback(err);
		}
	}

	/**
	 * Description: initializing application required packages [redis, elastic etc.]
	 * @param callback
	 */
	initializeApplication(callback) {
		if (this._args[0] === "seed") {
			new Seeder();
			return;
		}
		new (require("../").default);
		if (!!this._config.redis) new (require("../../libs/redis").default);
		if (!!this._config.elastic) new (require("../../libs/elastic").default);
		if (!!this._config.bugsnag) new (require("../bugsnag").default);
		// new ApiRoutesBuilder();
		callback(null, "success");
	}

	addSafeReadOnlyGlobal(prop, val) {
		Object.defineProperty(global, prop, {
			get: function () {
				return val;
			},
			set: function () {
				console.warn('You are trying to set the READONLY GLOBAL variable `', prop, '`. This is not permitted. Ignored!');
			}
		});
	}

	/**
	 * Description: returning function name to camel case.
	 * @param str
	 *
	 * example: abcDef => abc_def
	 */
	functionNameToVariableName(str) {
		return str.replace( /([a-z])([A-Z])/g, '$1_$2' ).toLowerCase();
	}
}
