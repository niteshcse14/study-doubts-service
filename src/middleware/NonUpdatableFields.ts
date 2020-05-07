declare var middleware: any, services: any, config: any;
export default class NonUpdatableFields {
	static init(request, fields): any {
		const _data = request.body, data = Array.isArray(_data) ? _data : [_data];
		return NonUpdatableFields.initUtil(request, data, fields);
	}

	static initUtil(request, data, fields): any {
		const errors = [];
		for (let i = 0; i < data.length; ++i) {
			for (let j = 0; j < fields.length; ++j) {
				if (data[i].hasOwnProperty(fields[j])) errors.push({
					type: config.TYPES.body,
					message: config.PERMISSION_MESSAGE[request.method](fields[j])
				});
			}
		}
		return errors;
	}
}
