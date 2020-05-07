import Connection from './Connection';

declare var config: any, services: any, middleware: any;
export default class MongoDBModel {

	static getOptions() {
		return {
			versionKey: false,
			strict: config.IS_DB_STRICT === true,
			timestamps: {
				createdAt: config.FIELDS.CREATED_AT,
				updatedAt: config.FIELDS.UPDATED_AT,
				currentTime: () => Math.floor(Date.now() / 1000)
			}
		};
	}

	static initialize(mongo_url, callback) {
		const _self: any = this;
		if (!mongo_url) throw new Error(config.mongo.MODEL_INITIALIZE_ERROR);

		new Connection(mongo_url, (err, db, mongoose) => {
			mongoose.pluralize(null);
			if (err) return callback(err);
			if (!_self.Schema) throw new Error(config.mongo.SCHEMA_NOT_FOUND);
			const schema = _self.getSchema(_self.Schema(mongoose), mongoose);
			const model = _self.getModel(schema, _self.Name ? _self.Name : services.util_services.functionNameToVariableName(_self.name), mongoose);

			(_self.Indexes || []).forEach(index => {
				schema.index(index);
			});
			model.createIndexes();
			callback(null, model);
		});
	}

	static getSchema(_schema, mongoose?: any) {
		return new mongoose.Schema({
			..._schema,
			is_deleted: { type: Boolean, enum: [true, false], default: false },
			created_at: { type: mongoose.Schema.Types.Mixed },
			updated_at: { type: mongoose.Schema.Types.Mixed },
			_id: { type: mongoose.Schema.Types.ObjectId, auto: true },
		}, this.getOptions());
	}

	static bindFunctions(schema, instance) {
		Object.getOwnPropertyNames(Object.getPrototypeOf(instance)).forEach(memberFn => {
			if (config.mongo.METHODS.indexOf(memberFn) < 0) {
				schema.methods[memberFn] = Object.getPrototypeOf(instance)[memberFn];
			}
		});

		Object.getOwnPropertyNames(this).forEach(staticFn => {
			if (config.mongo.METHODS.indexOf(staticFn) < 0) {
				schema.statics[staticFn] = this[staticFn];
			}
		});
	}

	static bindToJSON(schema, instance) {
		return function() {
			const doc = this._doc;
			doc.created_at = new Date(doc.created_at * 1000).toISOString();
			doc.updated_at = new Date(doc.updated_at * 1000).toISOString();
			delete doc.is_deleted;
			delete doc.other;
			return doc;
		};
	}

	static getModel(schema, name, mongoose?) {
		let instance = new this();
		if (!!!mongoose) {
			mongoose = require("mongoose");
			schema = this.getSchema(schema, mongoose);
		}
		else this.bindFunctions(schema, instance);
		mongoose.Schema.ObjectId.get(services.collection.convertToObjectId);
		this.initHooks(schema, instance);
		schema.methods.toJSON = this.bindToJSON(schema, instance);
		return mongoose.model(name, schema);
	}

	static initHooks(schema, instance) {
		schema.pre(config.mongo.keys.validate, MongoDBModel.validateObjectIds);
	}

	static async validateObjectIds(next) {
		const _self: any = this;
		const schema_obj = _self.schema.tree, keys = Object.keys(schema_obj);
		for (let i = 0; i < keys.length; ++i) {
			if (!!schema_obj[keys[i]].ref) {
				const model = services.util_services.functionNameToVariableName(schema_obj[keys[i]].ref), _id = services.collection.convertToObjectId(_self._doc[keys[i]]);
				const resp = await services.collection.find({
					model: model,
					headers: {},
					query: { _id: _id || -1 }
				}, {});
				if (!resp.length) {
					const errors = middleware.response.getErrorMessage(keys[i], config.API_RESPONSE.FIELD_INVALID);
					errors.message = "`" + keys[i] + "` value is not exits in " + model + " collection.";
					return next({ message: [errors]});
				}
			}
		}
		return true;
	}
}
