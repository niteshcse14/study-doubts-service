import ApiCriteriaBuilder from "../../../ApiCriteriaBuilder";

declare var config: any;
export default class Get implements ApiCriteriaBuilder {

	get headers(): any {
		return {};
	}

	get body(): any {
		return {};
	}

	// @ts-ignore
	get model() {
		return config.MODELS.USER_ASKED_QUESTION;
	}
};
