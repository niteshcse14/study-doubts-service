export default class Mongo {

	mongo: Object = {
		URL_NOT_FOUND: "Can not connect without a mongo url.",
		MODEL_INITIALIZE_ERROR: "MongoDb Url is required to initialize Mongo model.",
		SCHEMA_NOT_FOUND: "Please implement Schema in Model class.",
		METHODS: ['length', 'name', 'prototype', 'Name', 'Schema', 'Indexes', 'initialize', 'constructor'],
		keys: {
			error: "error",
			validate: "validate",
			open: "open",
			ready: "ready"
		}
	};
}
