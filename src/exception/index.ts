export default class Exception extends Error {
	code: any;
	status: any;

	constructor(code = 'GENERIC', status = 500, ...params) {
		super(...params);

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, Exception)
		}

		this.code = code;
		this.status = status;
	}
}
