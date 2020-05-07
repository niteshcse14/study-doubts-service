import ApiCriteriaBuilder from "../../../ApiCriteriaBuilder";

declare var config: any;
export default class Post implements ApiCriteriaBuilder {

	get headers(): any {
		return {};
	}

	get body(): any {
		return config.template.body;
	}
};
