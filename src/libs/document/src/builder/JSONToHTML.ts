export default class JSONToHTML {
	private static _config_data: {};
	private static getAdjacentList(_config) {
		let adj = [];
		const MAX = 500;
		for (let i = 1; i <= MAX; ++i) adj[i] = [];
		const nodes = Object.keys(_config);
		if (!nodes) return adj;
		for (let i = 0; i < nodes.length; ++i) {
			if (nodes[i] !== "tree_size" && nodes[i] !== "1") adj[_config[nodes[i]].parent].push(nodes[i]);
		}
		return adj;
	}

	private static getStyleString(css) {
		if (!!!css || typeof css === "string") return css;
		return Object.entries(css).reduce((styleString, [propName, propValue]) => {
			return styleString + propName + ':' + propValue + ";";
		}, "");
	};
	private static jsonToHtmlConfig(_config, config_data = {}) {
		JSONToHTML._config_data = config_data;
		let html = "", configKeys = Object.keys(_config), end = '" ';
		for (let i = 0; i < configKeys.length; ++i) {
			let key = configKeys[i].toString().trim().toLowerCase();
			if (key === 'style' || key === 'css') html += 'style="' + this.getStyleString(_config[configKeys[i]]) + (i + 1 === configKeys.length ? end.trim() : end);
			else html += configKeys[i] + '="' + _config[configKeys[i]] + (i + 1 === configKeys.length ? end.trim() : end);
		}
		return html;
	}
	static compileHTML = (html, _config) => {
		let ar = html.match(/{[ \w\d\[\].]*}/gm) || [];
		const _secret_keys = [];
		for (let i = 0; i < ar.length; ++i) {
			_secret_keys.push(ar[i]);
			ar[i] = ar[i].replace(/[{}]/gm, "").trim().split(/ /).filter(_val => _val);
		}
		for (let i = 0; i < ar.length; ++i) html = html.replace(_secret_keys[i], JSONToHTML.getObjectValueByString(_config, ar[i]));
		return html;
	};

	private static getObjectValueByString(obj, str_ar) {
		if (!str_ar || !obj) return;
		if (str_ar.length > 1 && str_ar[0] === "callback") {
			let nested_callback = undefined, callback = str_ar[1], args = [];
			for (let j = 2; j < str_ar.length; ++j) {
				if (obj.hasOwnProperty(str_ar[j])) args.push(this.getObjectValueByStringUtil(obj, str_ar[j]));
				else nested_callback = str_ar[j];
			}
			if (!!obj.bank_name && callback === "stringMasking" && obj.bank_name === "Paypal Bank") callback = "encryptEmail";
			return !!this[callback] ? this[callback](args, nested_callback) : this[callback](args, nested_callback);
		}
		else return this.getObjectValueByStringUtil(obj, str_ar[0]);
	}

	private static getObjectValueByStringUtil(obj, str) {
		const ar = str.replace(/\[(\w+)]/g, '.$1').replace(/^\./, '').split('.');
		for (let i = 0, n = ar.length; i < n; ++i) if (obj[ar[i]] !== undefined || obj[ar[i]] !== null) obj = obj[ar[i]]; else return;
		return obj;
	}
	private static jsonToHTMLUtil(adj, _config, curr, config_data = {}) {
		let res = "";
		res += '<' + _config[curr].tag + (!!_config[curr]._config ? ' ' + this.jsonToHtmlConfig(_config[curr]._config, config_data) : '') + '>' + (!!_config[curr].html ? this.compileHTML(_config[curr].html, config_data) : "");
		for (let i = 0; i < adj[curr].length; ++i) res += this.jsonToHTMLUtil(adj, _config, adj[curr][i], config_data);
		res += '</' + _config[curr].tag + '>';
		return res;
	};

	static init(_config, config_data = {}) {
		return this.jsonToHTMLUtil(this.getAdjacentList(_config), _config, 1, config_data);
	}
}
