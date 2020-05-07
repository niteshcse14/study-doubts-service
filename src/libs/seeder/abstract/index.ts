import JSON from "../type/json";
import XML from "../type/xml";
import CSV from "../type/csv";
import Type from "../type";
import AbstractType from "./AbstractType";

export default abstract class SeederBuilder implements AbstractType {
	collection: object;
	getType(type: string): Type {
		if (type === "json") return new JSON();
		if (type === "xml") return new XML();
		if (type === "csv") return new CSV();
		return null;
	}

	getCollection(): object {
		return this.collection;
	}

	abstract setCollection(collection: object)

	abstract readFile(_path: string, _encode?: string): any;
	abstract seed(data: any[], file: string, ext: string);
}
