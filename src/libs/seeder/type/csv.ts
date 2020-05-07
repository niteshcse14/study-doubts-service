import Type from "./";
import XLSX from "xlsx";

declare var services: any, _db: any;
export default class CSV implements Type {
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
		const workbook = XLSX.readFile(_path);
		const sheet_name_list = workbook.SheetNames;
		return callback(null, XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]));
	}
}
