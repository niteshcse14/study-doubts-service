import ServiceDocument from "service-document";

export default class JsonToHtml {
	static async post(request, response) {
		const obj: any = { html: request.body.html };
		return ServiceDocument.htmlToJson(obj);
	}
}
