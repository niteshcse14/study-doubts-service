import FieldsBuilder from "./base";

export default class Download extends FieldsBuilder {
	download: object = {
		pdf: {
			body: [
				this.getValidation(this.QUESTION),
				this.getValidation(this.USER_ID)
			]
		}
	}
};
