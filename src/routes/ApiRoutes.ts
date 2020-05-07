import fs from "fs";
import path from "path";
import ServerConnection from '../bootloader/application/lib/ServerConnection';

declare var middleware: any, services: any, config: any;
export default class ApiRoutes extends ServerConnection {
	end_points: Object[] = [];
	constructor() {
		super();
		config.ROUTES = {};
		config.EXPRESS = {};
		this.initializeRoutes(path.join(config.app_base_dir, config.routes), "/api");
	}

	private initializeRoutes(_path, route, parent = null): void {
		const dirs = this.getDirectories(_path).sort();
		for (let i = 0; i < dirs.length; ++i) {
			if (dirs[i].search(/\.[tj]s$/) === -1) this.initializeRoutes(_path + "/" + dirs[i], route + "/" + dirs[i], dirs[i]);
			else this.initRoute(this.apiFormatter(route, dirs[i].replace(/.[tj]s$/gm, ""), parent));
		}
	}

	private getDirectories(dir) {
		try {
			return fs.readdirSync(dir);
		} catch (err) {
			return [];
		}
	}

	private apiFormatter(route, method, model): any {
		return {
			method: method,
			route: route,
			model: model,
			_request_config: this.bindApiConfig(route + "/" + method),
		};
	}

	private bindApiConfig(route): any {
		route = route.replace(/\.[tj]s$/, "");
		const api = new (require(path.join(config.app_base_dir, "routes", route)).default), _config = {}, keys = Object.getOwnPropertyNames(Object.getPrototypeOf(api));
		for (let i = 0; i < keys.length; ++i) {
			if (keys[i] === "constructor") continue;
			_config[keys[i]] = api[keys[i]];
		}
		return _config;
	}

	private initRoute(_config): any {
		_config.route = services.util_services.functionNameToVariableNameRemovedUnderScore(_config.route);
		config.ROUTES[_config.method.toUpperCase() + _config.route] = true;
		_config._request_config.model = (_config._request_config.model ? services.util_services.functionNameToVariableName(_config._request_config.model) : _config.model).replace(/[-]/gm, "_").toLowerCase();
		const routes = [_config.route];
		this._app[_config.method](_config.route, middleware.http.validateRequest, middleware.http.callback);
		config.EXPRESS[_config.method + _config.route] = _config._request_config;
		if (_config.method != "post") {
			routes.push(_config.route + "/:_id");
			this._app[_config.method](_config.route + "/:_id", middleware.http.validateRequest, middleware.http.callback);
			config.EXPRESS[_config.method + _config.route + "/:_id"] = _config._request_config;
		}
		/*for (let i = 0; i < routes.length; ++i) {
			// this._app.request[_config.method + routes[i]] = _config._request_config;
			this.end_points.push({
				method: _config.method.toUpperCase(),
				end_point: routes[i],
				url: "http://" + config.URL + routes[i]
			})
		}*/
	}
};
