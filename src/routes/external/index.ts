import Base from "./base";
export default class External extends Base {
	get(config, url) {
		return this._get(config, url);
	}
};
