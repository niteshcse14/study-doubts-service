import Type from "./type";
import Producer from "./Producer";
import path from "path";
import MongoDBModel from "../mongo/lib/MongoDBModel";
import StringComparision from "../../utils/StringComparision";

declare var services: any, config: any, _db: any;
export default class Seeder extends Producer {
	private type: Type;
	private _path: string;
	private seeded_data: any;
	private seeded_count: number;
	private seeded_total: number;

	constructor() {
		super();
		console.log("seeder started");
		this.seeded_count = 0;
		this.seeded_data = [];
		this.init();
	}

	get path(): string {
		return this._path;
	}

	set path(_path: string) {
		this._path = _path;
	}

	init() {
		const type_map = {
			xlsx: "csv"
		};
		const files = services.file_system.getDirFiles(path.join(config.app_base_dir, "assets"));
		if (!files.length) process.exit();
		this.seeded_total = files.length;
		for (let i = 0; i < files.length; ++i) {
			const ext = path.extname(files[i]).toString(), ext_name = ext.replace(/[.]/, "");
			this.type = this.getType(type_map[ext_name] ? type_map[ext_name] : ext_name);
			let file = path.basename(files[i]).replace(/[" "]/gm, "").replace(ext, "");
			file = services.util_services.functionNameToVariableName(file);
			this.type.setFileName(services.util_services.functionNameToVariableName(file));
			const _self = this;
			this.type.toJSON(files[i], (err, content) => {
				if (!err) _self.seed(typeof content === "string" ? JSON.parse(content) : content, files[i], ext, i === files.length - 1);
				else this.seeded_count = +this.seeded_count + 1;
			});
		}
	}

	seed(data: any[], file, ext: string, close = false) {
		const _file = file;
		data = Array.isArray(data) ? data : [data];
		const seeded_data = [], file_base_name = path.basename(file).replace(/[" "]/gm, "").replace(ext, "");
		file = services.util_services.functionNameToVariableName(file_base_name);
		if ((config.IS_DB_STRICT === "true" || config.IS_DB_STRICT === true) && !_db[file]) {
			console.log("Invalid Model File " + file);
			this.validateProcess();
			return;
		} else if (_db[file] === undefined) {
			const model = MongoDBModel.getModel({}, file);
			this.setCollection(model);
			_db[file] = this.getCollection();
		}
		for (let i = 0; i < data.length; ++i) {
			const _data = this.validateData(data[i], file);
			let callback = config.FIELDS.INSERT, _config = {
				body: _data,
				query: {},
				model: file
			};
			if (!!data[i]._id) {
				callback = config.FIELDS.FIND_ONE_AND_UPDATE;
				_config.query["_id"] = _data._id;
			}
			const _dd = services.collection[callback](_config, {});
			seeded_data.push(_dd);
		}
		Promise.all(seeded_data).then(res => {
			services.file_system.writeFile(_file.replace(ext, ".json"), JSON.stringify(res, null, 4), (err, content) => {
				if (!err) {
					console.log("'" + file +"' successfully seeded.");
					if (ext !== ".json") services.file_system.unlink(_file, function (err1) {
						if (!err1) console.log(file + " deleted !!");
					});
				}
				else console.log(err);
				this.validateProcess();
			});
		}).catch(err => {
			console.log("Err ", err);
		});
	}

	validateProcess() {
		this.seeded_count = +this.seeded_count + 1;
		if (this.seeded_count >= this.seeded_total) process.exit();
	}
	validateData(data, model): any {
		const schema_obj = _db[model].schema.tree, keys = Object.keys(schema_obj);
		const _data_keys = Object.keys(data);
		for (let i = 0; i < _data_keys.length; ++i) {
			let _key = _data_keys[i], _value = data[_key], mx = config.Default.INF;
			if (!!schema_obj[_key] && schema_obj[_key].type.name === "String" && !!schema_obj[_key].enum) {
				for (let j = 0; j < schema_obj[_key].enum.length; ++j) {
					const dist = StringComparision.distance(_value, schema_obj[_key].enum[j]);
					if (dist < mx) {
						_value = schema_obj[_key].enum[j];
						mx = dist;
					}
				}
			}
			data[_key] = _value;
		}
		return data;
	}
}
