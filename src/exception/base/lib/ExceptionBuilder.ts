export default class ExceptionBuilder extends Error{
	constructor() {
		super();
		/*if (Error.captureStackTrace) {
			Error.captureStackTrace(this)
		}*/
	}
}
