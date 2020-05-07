import URLType from "./interfaces/URLType";

export default class URLBuilder implements URLType {
	private _method: string;
	private _query: object;
	private _url: string;

	get method(): string {
		return this._method;
	}

	set method(value: string) {
		this._method = value;
	}

	get query(): object {
		return this._query;
	}

	set query(value: object) {
		this._query = value;
	}

	get url(): string {
		return this._url;
	}

	set url(value: string) {
		this._url = value;
	}

	get toJSON() {
		return {
			method: this._method,
			url: this._url,
			query: this._query,
		};
	}
}
