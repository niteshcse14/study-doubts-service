import StyleConfigType from "./StyleConfigType";

export default interface PDFFormatType {
	getBase(content, config: StyleConfigType);
	getPDF(content, config: StyleConfigType);
}
