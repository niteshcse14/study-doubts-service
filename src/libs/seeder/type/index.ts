export default interface Type {
	getFileName(): string;
	setFileName(file_name: string): void;
	getData(_path: string, callback: Function): void;
	toJSON(_path: string, callback: Function): void;
	// readFile(): any;
}
