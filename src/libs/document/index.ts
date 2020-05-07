import PDFBuilder from "./src/builder/PDFBuilder";
import HTMLToJSON from "./src/builder/HTMLToJSON";
import JSONToHTML from "./src/builder/JSONToHTML";

export default class Main {
	static jsonToHtml(_config, config_data = {}): any {
		return JSONToHTML.init(_config, config_data);
	}
	static htmlToJson(_config) {
		return HTMLToJSON.init(_config);
	}

	static compileHTML(html, _config) {
		return JSONToHTML.compileHTML(html, _config);
	}

	static htmlToPdf() {
		return PDFBuilder;
	}
}
