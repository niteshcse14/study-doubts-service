import Type from "./";

declare var services: any, _db: any;
export default class JSON implements Type {
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

	toJSON(_path, callback) {
		return this.getData(_path, callback);
	}
}
