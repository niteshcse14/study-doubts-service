import ApiCriteriaBuilder from "../../../ApiCriteriaBuilder";

declare var config: any;
export default class Patch implements ApiCriteriaBuilder {

	get permissionDeniedToUpdate(): any {
		return config.user.permission_denied;
	}
};
