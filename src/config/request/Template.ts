import FieldsBuilder from "./base";

export default class Template extends FieldsBuilder {
	template: Object = {
		body: [
			this.getValidation(this.HTML)
		]
	}
};
