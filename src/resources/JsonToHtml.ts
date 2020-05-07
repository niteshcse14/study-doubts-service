import ServiceDocument from "service-document";

export default class JsonToHtml {
	static async post(request, response) {
		return ServiceDocument.jsonToHtml({
			html: request.body.html
		});
	}
}
