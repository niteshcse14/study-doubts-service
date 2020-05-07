import PdfResource from "../../resources/Pdf";

export default class Pdf {
	static async post(request, response) {
		return await PdfResource.post(request, response);
	}
}
