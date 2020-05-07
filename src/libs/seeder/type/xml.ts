import Type from "./";
import XML_JS from "xml-js";

declare var services: any, _db: any;
export default class XML implements Type {
	private file_name: string;
	setFileName(file_name): void {
		this.file_name = file_name;
	}

	getFileName(): string {
		return this.file_name;
	}

	getData(_path, callback) {
		return services.file_system.readFile(_path, callback);
	}

	toJSON(_path, callback, options: any = { compact: true, spaces: 4 }) {
		this.getData(_path, function (err, content) {
			if (err) callback(null);
			else callback(null, XML_JS.xml2json(content, options));
		})
	}
}
