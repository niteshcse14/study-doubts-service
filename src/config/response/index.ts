import Status from "./base/Status";

declare var config: any;
export default class ApiResponse extends Status {

	REF: String = "child_nodes";
	MIN_MAX_LEN: String = "min_max_len";
	MIN_MAX_VAL: String = "min_max_val";
	OPTIONAL: String = "optional";
	TYPEOF: String = "typeof";
	IS_REQUIRED: String = "required";
	DEFAULT_VALUE: String = "value";
	REGEX: String = "regex";

	ORCHESTRATOR_FIELDS: Object = {
		REQUIRED: "required",
		PATTERN: "pattern",
		MULTIPLE_PATTERN: "multiple_pattern",
		MIN_LENGTH: "minlength",
		MAX_LENGTH: "maxlength",
	};

	METHOD: any = {
		GET: "GET",
		POST: "POST",
		UPDATE: "UPDATE",
		PATCH: "PATCH",
		PUT: "PUT",
		DELETE: "DELETE",
	};

	MONGO_DOC: any = {
		GET: "find",
		POST: "insert",
		UPDATE: "update",
		PATCH: "update",
		PUT: "replaceOne",
		DELETE: "remove",
	};


	API_RESPONSE: any = {
		FAILED: "FAILED",
		FAILURE: "FAILURE",
		BAD_REQUEST: "BAD_REQUEST",
		FIELD_REQUIRED: "FIELD_REQUIRED",
		TOO_MANY_REQUEST: "TOO_MANY_REQUEST",
		FIELD_INVALID: "FIELD_INVALID",
		INVALID_TYPE: "INVALID_TYPE",
		FIELD_DUPLICATE: "FIELD_DUPLICATE",
		SUCCESS: "SUCCESS",
		OK: "OK",
		NOT_FOUND: "NOT_FOUND",
		RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",
	};

	getApiResponse(field) {
		return {
			code: this[field + "_CODE"],
			status: this.getKey(this[field + "_STATUS"]),
			message: this[field + "_MESSAGE"]
		};
	}
	getApiErrorResponse(type, parameter?: any, message?: any) {
		const obj: any = {};
		obj.type = this[type + "_STATUS"] || type;
		if (parameter) obj.parameter = parameter;
		obj.message = message || this[type + "_MESSAGE"];
		return obj;
	}

	getKey(value: string) {
		if ((config.IS_DB_STRICT === false || config.IS_DB_STRICT === "false") && value) return value.toLowerCase();
		return value;
	}
}
