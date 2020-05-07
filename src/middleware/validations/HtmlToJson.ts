import HtmlToJsonResource from "../../resources/HtmlToJson";

export default class HtmlToJson {
	static async post(request, response) {
		return await HtmlToJsonResource.post(request, response);
	}
}
