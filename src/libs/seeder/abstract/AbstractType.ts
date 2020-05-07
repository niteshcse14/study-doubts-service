import Type from "../type";

export default interface AbstractType {
	setCollection(collection: object): void;
	getCollection(): object;
	getType(type: string): Type;
	readFile(_path: string, callback: any): any;
	seed(data: any[], file: string, ext: string);
}
