import JsonToHtmlResource from "../../resources/JsonToHtml";

export default class JsonToHtml {
	static async post(request, response) {
		return await JsonToHtmlResource.post(request, response);
	}
}
