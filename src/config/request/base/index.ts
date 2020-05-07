import Constant from "../../base";

export default class FieldsBuilder extends Constant {
	getValidation(name, is_required = true, validations: [] = [], type: any = null) {
		const validation = (Array.isArray(validations) && validations.length) ? validations : [{
			name: "required",
			type: type
		}];
		return {
			name: name.toLowerCase(),
			validations: validation
		};
	}
}
