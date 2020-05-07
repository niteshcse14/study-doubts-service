import ApiCriteriaBuilder from "../../../ApiCriteriaBuilder";

declare var config: any;
export default class Post implements ApiCriteriaBuilder {

	get body(): any {
		return config.user.body;
	}
};
