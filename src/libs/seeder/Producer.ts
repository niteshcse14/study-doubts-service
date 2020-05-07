import SeederBuilder from "./abstract";

declare var services: any, _db: any;
export default abstract class Producer extends SeederBuilder {
	readFile(_path: string, callback: any): any {
		return services.file_system.readFile(_path, callback);
	}

	setCollection(collection: object) {
		this.collection = collection;
	}

	abstract seed(data: any[], file: string, ext: string);
}
