declare var middleware: any, services: any, config: any;
export default class Fields {

	static arrayFieldsValidation(data, fields, action_type = undefined) {
		if (!Array.isArray(data)) return new Error("Invalid Type");
		for (let i = 0; i < data.length; ++i) {
			const errors = this.initUtil(data[i], fields, action_type);
			if (errors.length) return errors;
		}
		return [];
	}

	static initUtil(data, fields, action_type = undefined): any {
		const error_validations = [];
		for (let i = 0; i < fields.length; ++i) {
			let validation_fields: any = fields[i].validations, request_key = fields[i].name, forward_further = true;
			if (!data) return error_validations.push(config.getApiErrorResponse(config.API_RESPONSE.FIELD_REQUIRED, request_key));
			for (let j = 0; forward_further && validation_fields && j < validation_fields.length; ++j) {
				if (action_type && !validation_fields[j].action) continue;
				if (validation_fields[j].type === "array" && !Array.isArray(data[request_key])) error_validations.push(config.getApiErrorResponse(config.API_RESPONSE.INVALID_TYPE, request_key));
				if (!!validation_fields[j].field_arr) {
					const _data = Array.isArray(data[request_key]) ? data[request_key] : [data[request_key]];
					for (let k = 0; k < _data.lenth; ++k) error_validations.push(...Fields.initUtil(data[k][request_key], validation_fields[j].field_arr, action_type));
				}
				if (action_type === undefined || (validation_fields[j].action && services.util_services.isValueAvailable(validation_fields[j].action, action_type))) {
					if (data[request_key] === undefined) forward_further = false;
					else if (Fields[validation_fields[j].name](data[request_key], validation_fields[j]) === false) forward_further = false;
				}
			}
			if (!forward_further) error_validations.push(middleware.response.getErrorMessage(request_key, data[request_key] ? config.FIELD_INVALID_STATUS : config.FIELD_REQUIRED_STATUS));
		}
		return error_validations;
	}

	static getErrorsMessage(ar) {
		const err_resp = [];
		for (let i = 0; ar.length; ++i) if (Fields[ar[i].type](ar[i].value, ar[i].validations)) err_resp.push(ar[i].message);
		return err_resp;
	}

	static required(value, validation) {
		return value !== undefined && value !== null;
	}

	static pattern(value, validation) {
		return services.util_services.validateRegex(value, validation.validations);
	}

	static minlength(value, validation) {
		return services.util_services.rangeValidator(value.length, [+validation.args]);
	}

	static maxlength(value, validation) {
		return !services.util_services.rangeValidator(value.length, [null, +validation.args]);
	}

	static multiplePattern(value, validation) {
		for (let i = 0; i < validation.validations.length; ++i) {
			if (!Fields.pattern(value, validation.validations[i])) return false;
		}
		return true;
	}
}
