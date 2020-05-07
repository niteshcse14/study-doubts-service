import puppeteer from "puppeteer";
import StyleConfigType from "../interfaces/StyleConfigType";

export default class PDFBuilder {
	static async getBuffer(content, config: StyleConfigType = {}) {
		const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
		const page = await browser.newPage();
		await page.setContent(content);

		if(config.style) await page.addStyleTag({ content: config.style });
		let margin: object = { top: "30px", bottom: '30px', left: "50px", right: "50px" };
		if(config.margin) margin = config.margin;
		const buffer = await page.pdf({
			format: 'Letter',
			margin: margin
		});
		browser.close();
		return buffer;
	}

	static async getBase64(content, config: StyleConfigType = {}) {
		return Buffer.from(await this.getBuffer(content, config)).toString('base64');
	}
}
