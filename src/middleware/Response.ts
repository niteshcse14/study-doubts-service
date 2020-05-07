declare var config: any, _db: any;
export default class Response {
	static getErrorMessage(key, type: String = config.API_RESPONSE.FIELD_INVALID) {
		const resp = {
			type: type || config[type + "_STATUS"],
			parameter: key,
			message: config[type + "_MESSAGE"]
		};
		if (!key) delete resp.parameter;
		return resp;
	}

	static throwErrorMessage(obj, errors) {
		let resp: any = {};
		if (typeof obj === "object") resp = { ...obj };
		else resp = { ...config.getApiResponse(obj) };
		if (!!errors && typeof errors === "object") resp.errors = Array.isArray(errors) ? errors : [errors];
		else resp.message = errors;
		return new Error(JSON.stringify(resp))
	}

	static getFieldsError(errors) {
		return new Error(JSON.stringify({ ...config.getApiResponse(config.API_RESPONSE.BAD_REQUEST), errors: errors }));
	}

	static get urlNotFound() {
		return {
			...config.getApiResponse(config.API_RESPONSE.FAILURE),
			errors: [config.getApiErrorResponse(config.API_RESPONSE.RESOURCE_NOT_FOUND, null, config.RESOURCE_NOT_FOUND_MESSAGE)],
		}
	}

	static throwError(key) {
		return Response.throwErrorMessage(key, config.getApiErrorResponse(key))
	}

	static sendResponse(request, response, response_obj = undefined) {
		if (!!response_obj.data) {
			if (request.model) {
				response_obj.resource = request.model.toLowerCase();
				response_obj.resource_url = config.URL + request.path;
			} else delete response_obj.message;
		}
		if (!!response_obj.errors) delete response_obj.message;
		else if (!!response_obj.data) {
			delete response_obj.errors;
			response_obj.total = Array.isArray(response_obj.data) ? response_obj.data.length : 1;
		}
		if (request.method === config.METHOD.POST && (!request.model || !_db[request.model]) && response_obj.code === config.CREATED_CODE) {
			response_obj = { ...response_obj, ...config.getApiResponse(config.API_RESPONSE.OK) };
			delete response_obj.message;
		}
		if (response_obj.status && !config.IS_DB_STRICT) response_obj.status = response_obj.status.toLowerCase();
		return response.status(response_obj.code).send(response_obj);
	}

	static sendExceptionResponse(exception, response_obj) {
		const error_resp = [];
		if (!!exception.errors) {
			delete response_obj.message;
			delete response_obj.message;
			const error_keys = Object.keys(exception.errors);
			for (let i = 0; i < error_keys.length; ++i) {
				error_resp.push({
					type: exception.errors[error_keys[i]].kind,
					parameter: error_keys[i],
					message: config.FIELD_REQUIRED_MESSAGE,
				});
			}
			response_obj.errors = error_resp;
		} else delete response_obj.errors;
		return response_obj;
	}
}
