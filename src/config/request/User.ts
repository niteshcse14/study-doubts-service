import FieldsBuilder from "./base";

export default class User extends FieldsBuilder {
	user: Object = {
		body: [
			this.getValidation(this.NAME),
			this.getValidation(this.EMAIL),
			this.getValidation(this.PHONE_NUMBER),
			this.getValidation(this.CLASS),
			this.getValidation(this.ADDRESS)
		],
		permission_denied: [
			this.getValidation(this.EMAIL),
			this.getValidation(this.PHONE_NUMBER),
		]
	}
};
