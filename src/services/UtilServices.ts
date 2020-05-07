import URLBuilder from "./base/URLBuilder";

export default class UtilServices extends URLBuilder{

	/**
	 * urlDecoding : urlDecoding
	 *
	 * @author Nitesh <nitesh.nituk14@gmail.com>
	 *
	 * @param encodedURL string
	 */
	urlDecoding(encodedURL) {
		if (!!!encodedURL) return;
		return encodedURL.replace(/%20/gm, '/');
	};

	/**
	 * getOptionsUtil : converting json to accurate request option
	 *
	 * @author Nitesh <nitesh.nituk14@gmail.com>
	 *
	 * @param config object
	 */

	getOptionsUtil(config) {
		return {
			url: this.urlDecoding(config.url) + (config.queryParams ? ('?' + config.queryParams) : ''),
			method: config.method,
			headers: config.headers,
			qs: !!config.qs ? config.qs : {},
			body: JSON.stringify(config.body)
		};
	};

	/**
	 * getOptions : converting json to accurate request option
	 *
	 * @author Nitesh <nitesh.nituk14@gmail.com>
	 *
	 * @param config object
	 */

	getOptions(config) {
		const configObj = this.getOptionsUtil(config);
		if (!configObj.headers) delete configObj.headers;
		if (!configObj.body) delete configObj.body;
		if (!!configObj.qs && !Object.keys(configObj.qs).length) delete configObj.qs;
		return configObj;
	};

	/**
	 * extractTargetData : extracting target data
	 *
	 * @author Nitesh <nitesh.nituk14@gmail.com>
	 *
	 * @param keys object
	 * @param data object
	 */

	extractTargetData(keys, data) {
		const config = {};
		for (let i = 0; i < keys.length; ++i) config[keys[i]] = data[keys[i]];
		return config;
	};

	/**
	 * initializeObject : initializing all keys of object to given value
	 *
	 * @author Nitesh <nitesh.nituk14@gmail.com>
	 *
	 * @param obj
	 * @param value
	 */

	initializeObject(obj: Object, value: any[]) {
		const keys = Object.keys(obj), _obj = {};
		for (let i = 0; i < keys.length; ++i) _obj[obj[keys[i]]] = Object.assign([], value);
		return _obj;
	};

	/**
	 * deleteUnwantedKeys : returning expected keys object
	 *
	 * @author Nitesh <nitesh.nituk14@gmail.com>
	 *
	 * @param obj
	 * @param keys
	 */

	deleteUnwantedKeys(obj: Object, keys: any[]) {
		const resp = {};
		Object.assign(resp, obj);
		for (let i = 0; i < keys.length; ++i) if (!!resp[keys[i]]) delete resp[keys[i]];
		return resp;
	};

	/**
	 * removeUnderscoreWithCamelCase : returning string after removing [_] and converting in camel case
	 *
	 * @author Nitesh <nitesh.nituk14@gmail.com>
	 *
	 * @param str
	 */

	removeUnderscoreWithCamelCase(str: String) {
		return str.charAt(0).toUpperCase() + str.slice(1).replace(/([-_][a-z0-9])/ig, (val) => val.toUpperCase().replace(/[-_]/gm, ''));
	};

	/**
	 * validateRegex : validating regex on given value
	 *
	 * @author Nitesh <nitesh.nituk14@gmail.com>
	 *
	 * @param str
	 * @param regex
	 */

	validateRegex(str: any, regex: any) {
		return new RegExp(regex.substr(1, regex.length - 2)).test(str);
	};

	/**
	 * rangeValidator : validating range
	 *
	 * @author Nitesh <nitesh.nituk14@gmail.com>
	 *
	 * @param value
	 * @param config_val
	 */

	rangeValidator(value: Number, config_val: any) {
		if (!config_val) return false;
		return ((!!config_val[0] && config_val[0] < value) || (config_val.length === 2 && value > config_val[1]));
	};

	/**
	 * isValueAvailable : extracting target data
	 *
	 * @author Nitesh <nitesh.nituk14@gmail.com>
	 *
	 * @param obj
	 * @param value
	 */

	isValueAvailable(obj: Object, value: String) {
		if (typeof obj !== "object") return null;
		const ar = Array.isArray(obj) ? obj : Object.values(obj);
		for (let i = 0; i < ar.length; ++i) if (ar[i] === value) return true;
		return false;
	};

	/**
	 * getObjectValue : returning object value
	 *
	 * @author Nitesh <nitesh.nituk14@gmail.com>
	 *
	 * @param obj object
	 * @param str string
	 */

	getObjectValue(obj, str) {
		const ar = str.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '').split('.');
		for (let i = 0; i < ar.length; ++i) if (!!obj[ar[i]]) obj = obj[ar[i]]; else return;
		return obj;
	};

	/**
	 * generateQueryParams : generating JSON to QueryParams
	 *
	 * @author Nitesh <nitesh.nituk14@gmail.com>
	 *
	 * @param obj object
	 */
	generateQueryParams(obj) {
		if (obj === undefined || obj === null) return "";
		let query_prams = '', flag = false;
		const keys = Object.keys(obj);
		for (let i = 0; i < keys.length; ++i) {
			flag = true;
			query_prams += `${(i > 0) ? '&': ''}${keys[i]}=${obj[keys[i]]}`;
		}
		return (flag ? "?" : "") + query_prams;
	};

	/**
	 * generateRoute : merging multiple end-points in single end-point
	 *
	 * @author Nitesh <nitesh.nituk14@gmail.com>
	 *
	 * @param _config
	 * @param url
	 */

	generateRoute(_config, url) {
		return url + this.generateQueryParams(_config.query);
	};

	concatRoute(routes) {
		routes = Array.isArray(routes) ? routes : [routes];
		if (routes.length === 1) return routes[0];
		let route = "";
		for (let i = 0; i < routes.length - 1; ++i) route += routes[i].replace(/\/$/m, "") + "/";
		return route;
	}

	removeUnexpectedKeys(obj, arr) {
		const resp = {};
		Object.assign(resp, obj);
		for (let i = 0; i < arr.length; ++i) {
			delete resp[arr[i]];
		}
		return resp;
	}

	functionNameToVariableNameRemovedUnderScore(str) {
		return str.replace(/[_]/gm, "-").replace( /([a-z])([A-Z])/g, '$1_$2' ).toLowerCase();
	}

	functionNameToVariableName(str) {
		return str.replace( /([a-z])([A-Z])/g, '$1_$2' ).toLowerCase();
	}

	getRequestFields(request: any) {
		return { query: request.query, data: request.body, params: request.params, headers: request.headers };
	}

	listToTree(list, child_key) {
		let map = {}, node, roots = [], i;
		for (i = 0; i < list.length; ++i) map[list[i]._id] = i;
		for (i = 0; i < list.length; ++i) {
			node = list[i];
			if (+node.parent_id !== 0) {
				if (!list[map[node.parent_id]][child_key]) list[map[node.parent_id]][child_key] = [];
				list[map[node.parent_id]][child_key].push(node);
			}
			else roots.push(node);
		}
		return roots;
	}

	getKeyValues(arr_obj, key) {
		const resp = [];
		if (!arr_obj) return resp;
		arr_obj = Array.isArray(arr_obj) ? arr_obj : [arr_obj];
		for (let i = 0; i < arr_obj.length; ++i) resp.push(arr_obj[i][key]);
		return resp;
	}
};
