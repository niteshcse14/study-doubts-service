const ObjectId = require("mongoose").Types.ObjectId;

declare var services: any, _db: any, config: any, event: any;
export default class Collection {

	/**
	 * get : returning mongo Document
	 *
	 * @author Nitesh <nitesh.nituk14@gmail.com>
	 *
	 * @param request
	 * @param response
	 * @param other
	 */
	protected find(request, response = {}, other: any = {}) {
		const _config = { ...services.util_services.getRequestFields(request), ...other};
		const aggregate_options = [], skip = Math.max(0, Number(+(_config.query.start || 1) - 1));
		let alias, _alis = {}, query = { ..._config.query, ..._config.params }, populate = [], select = [], hide = [], _hide: any = {}, _select: any = { }, sort_by = _config.query.sort_by, sort_by_keys = sort_by ? sort_by.split(",") : [], _sort_by: any = {}, limit: Number = 0;
		let child_ref = [];
		let db_query = services.util_services.deleteUnwantedKeys(query, ["fields", "d_fields", "sort_by", "expands", "limit", "start", "child_ref"]), db_query_keys = Object.keys(db_query);
		try {
			limit = +_config.query.limit || limit;
			if (!db_query._id) delete db_query._id;

			child_ref = query.child_ref ? query.child_ref.split(",") : [];
			alias = query.alias ? query.alias.split(",") : [];
			populate = query.expands ? query.expands.split(",") : populate;
			select = query.fields ? query.fields.split(",") : select;
			hide = query.d_fields ? query.d_fields.split(",") : hide;

			for (let i = 0; i < db_query_keys.length; ++i) {
				let schema_paths = _db[request.model].schema.paths, n = db_query_keys[i].length, key = db_query_keys[i], old_key = key, ch = db_query_keys[i][n - 1], _ch = ch;
				if (!db_query[db_query_keys[i]]) {
					delete db_query[db_query_keys[i]];
					continue;
				} else if (db_query[key][0] === "=") {
					ch += "=";
					db_query[key] = db_query[key].replace(/[=]/gm, "");
				} else if (db_query_keys[i].search(/.in$/) !== -1) {
					key = db_query_keys[i].replace(/.in$/, "");
					db_query[key] = this.in(db_query[old_key]);
					delete db_query[old_key];
				}
				if (!!config.operators[ch]) {
					key = db_query_keys[i].replace(_ch, "");
					db_query[key] = this[config.operators[ch]](db_query[db_query_keys[i]]);
					delete db_query[db_query_keys[i]];
				}
				// else if (!!schema_paths[key] && schema_paths[key].instance === "ObjectID" && old_key === key) {
				else if (!!schema_paths[key] && key === config.FIELDS._ID && !populate.length) {
					db_query[key] = this.convertToObjectId(db_query[key]);
				}
				db_query[key] = !isNaN(db_query[key]) ? +db_query[key] : db_query[key];
			}

			if (!!_config.query.count) {
				const project = {
					_id: 0,
					count: 1
				};
				project[_config.query.count] = "$_id";
				return _db[request.model].aggregate([this.group({ _id: "$" + _config.query.count, count: { $sum: 1 }}), this.project(project)]);
			}
			/*if (!!_config.headers && Boolean(_config.headers[config.FIELDS.X_TOTAL_COUNT]) === true) {
				aggregate_options.push(this.group());
				aggregate_options.push(this.project());
				return _db[request.model].aggregate(aggregate_options);
			}*/

			for (let i = 0; !alias.length && i < hide.length; ++i) _hide[hide[i].trim()] = 0;
			for (let i = 0; i < select.length; ++i) {
				if (_hide.hasOwnProperty(select[i].trim())) delete _hide[select[i].trim()];
				_select[select[i].trim()] = 1;
			}
			for (let i = 0; i < sort_by_keys.length; ++i) _sort_by[sort_by_keys[i].replace(/[-+]/, "")] = sort_by_keys[i][0] === "-" ? -1 : 1;
			if (populate.length) aggregate_options.push(this.addFields(this.convert()));
			for (let i = 0; i < populate.length; ++i) {
				let _key = populate[i];
				if (config.EXPANDS[populate[i]]) _key = config.EXPANDS[populate[i]];
				aggregate_options.push(this.lookup(_key, "_id", "app_id", populate[i]));
			}
			for (let i = 0; i < alias.length; ++i) {
				let val = alias[i].split(":");
				if (val.length < 2) val = [val[0], val[0]];
				if (_select[val[0].toString().trim()] === 1) delete _select[val[0].toString().trim()];
				_alis[val[1].toString().trim()] = "$" + val[0].toString().trim();
				_alis["_id"] = 0;
			}
			if (!sort_by_keys.length) _sort_by.created_at = 1;
			aggregate_options.push(this.sort(_sort_by));
			aggregate_options.push(this.skip(skip));

			db_query.is_deleted = this.ne(true);
			_hide.is_deleted = 0;
			_hide.other = 0;
			// db_query._id = this.convertToObjectId(db_query._id);
			aggregate_options.push(this.match(db_query));
			aggregate_options.push(this.project(_hide));
			if (select.length) aggregate_options.push(this.project(_select));
			if(limit) aggregate_options.push(this.limit(limit));
			if (child_ref.length) {
				for (let i = 0; i < child_ref.length; ++i) {
					const collection_and_foreign_key = child_ref[i].split(":");
					if (collection_and_foreign_key.length < 2) continue;
					aggregate_options.push(this.lookup(collection_and_foreign_key[0].trim(), "_id", collection_and_foreign_key[1].trim()));
					const obj = {};
					obj[collection_and_foreign_key[0] + "." + config.FIELDS.OTHER] = 0;
					obj[collection_and_foreign_key[0] + "." + config.FIELDS.IS_DELETED] = 0;
					aggregate_options.push(this.project(obj));
				}
			}
			aggregate_options.push(this.addFields({
				created_at: { $toDate: { $multiply: ['$' + config.FIELDS.CREATED_AT, 1000] }},
				updated_at: { $toDate: { $multiply: ['$' + config.FIELDS.UPDATED_AT, 1000] }}
			}));
			if (!!_config.headers && Boolean(_config.headers[config.FIELDS.X_TOTAL_COUNT]) === true) {
				aggregate_options.push(this.group());
				aggregate_options.push(this.project());
				// return _db[request.model].aggregate(aggregate_options);
			}
			return _db[request.model].aggregate(aggregate_options);
		} catch (exception) {
			return new Error(exception.message);
		}
	};

	/**
	 * update : finding and updating document
	 * @author Nitesh <nitesh.nituk14@gmail.com>
	 *
	 * @param request
	 * @param response
	 * @param other
	 */
	protected update(request, response, other: any = {}) {
		const options = { new: true, useFindAndModify: true };
		return this.findOneAndUpdate(request, response, { db: options });
	}

	/**
	 * findOneAndUpdate : finding and updating document
	 *
	 * @author Nitesh <nitesh.nituk14@gmail.com>
	 *
	 * @param request
	 * @param response
	 * @param other
	 */
	protected findOneAndUpdate(request, response, other: any = {}) {
		let options = { upsert: true, new: true };
		if (other.db) {
			options = options = other.db;
			delete other.db;
		}
		request.query.is_deleted = this.ne(true);
		const obj = { ...services.util_services.getRequestFields(request), ...other}, db_query = {}, query = { ...obj.query, ...obj.params }, keys = Object.keys(query);
		for (let i = 0; i < keys.length; ++i) db_query[keys[i]] = typeof query[keys[i]] === "string" ? this.in(query[keys[i]].split(",")) : query[keys[i]];
		return _db[request.model].findOneAndUpdate(db_query, { $set: obj.data }, options);
	}

	/**
	 * insert : adding new document
	 *
	 * @author Nitesh <nitesh.nituk14@gmail.com>
	 *
	 * @param request
	 * @param response
	 * @param other
	 */
	protected insert(request, response = {}, other: any = {}) {
		const _config = { ...services.util_services.getRequestFields(request), ...other};
		return new _db[request.model](_config.data).save();
	}

	/**
	 * remove : adding new document
	 *
	 * @author Nitesh <nitesh.nituk14@gmail.com>
	 *
	 * @param request
	 * @param response
	 */

	protected remove(request, response) {
		return this.delete(request, response)
	}

	protected delete(request, response) {
		request.body.deleted_at = new Date();
		request.body.is_deleted = true;
		return this.update(request, response);
	}

	protected undo(request, response) {
		request.body.deleted_at = new Date();
		request.body.is_deleted = false;
		return this.update(request, response)
	}

	protected _delete(request, response) {
		const _config = services.util_services.getRequestFields(request), db_query = {}, query = { ..._config.query, ..._config.params, is_deleted: false };
		const keys = Object.keys(db_query);
		for (let i = 0; i < keys.length; ++i) db_query[keys[i]] = this.in(query[keys[i]].split(","));
		return _db[request.model].deleteMany(db_query);
	}
	/**
	 * replaceOne : adding new document
	 *
	 * @author Nitesh <nitesh.nituk14@gmail.com>
	 *
	 * @param request
	 * @param response
	 * @param p
	 */
	protected async replaceOne(request, response, p: { new: boolean; useFindAndModify: boolean }) {
		const _config = services.util_services.getRequestFields(request), query = { ..._config.query, ..._config.params, is_deleted: false };
		return _db[request.model].replaceOne(query, _config.data, { new: true, useFindAndModify: true });
	}

	lookup(from, local_field, foreign_field, as = undefined) {
		return {
			$lookup: {
				from: from,
				localField: local_field,
				foreignField: foreign_field,
				as: as || from
			}
		};
	}

	group(query: any = { _id: null, total: { $sum: 1 } }) {
		return { $group: query };
	}

	project(query: any = { _id: 0 }) {
		return { $project: query };
	}

	addFields(query: any) {
		return { $addFields: query };
	}

	/*
	type code
	1: toObject,
	2: int,
	else: toString
	* */
	convert(field = "_id", type: number = -1) {
		let obj = {}, convert_type = "toString";
		obj[field] = {};
		if (type == 1) convert_type = "toObjectId";
		else if (type == 2) convert_type = "parseInt";
		obj[field]["$" + convert_type] = "$" + field;
		return obj;
	}

	in(query: any) {
		return { $in: query };
	}

	ne(value: any) {
		return { $ne: value };
	}

	gt(value: String) {
		return { $gt: +value };
	}

	gte(value: String) {
		return { $gte: +value };
	}

	lt(value: String) {
		return { $lt: +value };
	}

	lte(value: String) {
		return { $lte: +value };
	}

	skip(value: Number) {
		return { $skip: +value };
	}

	limit(query: {}) {
		return { $limit: query };
	}

	sort(query: {}) {
		return { $sort: query };
	}

	match(query: {}) {
		return { $match: query };
	}

	convertToObjectId(id) {
		if (!id) return null;
		if (id instanceof ObjectId) return id;

		try {
			return ObjectId(id);
		}
		catch (c) {
			return null;
		}
	}
};
