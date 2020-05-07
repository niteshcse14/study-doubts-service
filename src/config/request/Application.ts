import FieldsBuilder from "./base";

export default class Application extends FieldsBuilder {

	application: Object = {
		params: [this.getValidation(this._ID)]
	};
};
