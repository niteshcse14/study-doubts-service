import fs from "fs";
import path from "path";

export default class FileSystem {
	readFile(path, callback) {
		try {
			fs.readFile(path, "utf8", callback)
		} catch (exception) {}
	}
	readFileSync(path, encode: string = "utf8") {
		try {
			return fs.readFileSync(path, encode)
		} catch (exception) {
			return new Error(exception)
		}
	}

	writeFile(path, data, callback) {
		try {
			fs.writeFile(path, data, <any>function (err) {
				if (!err) return callback(null);
				return callback(err);
			})
		} catch (exception) {
			callback(new Error(exception))
		}
	}

	writeFileSync(path, options) {
		try {
			return fs.writeFileSync(path, options)
		} catch (exception) {
			return new Error(exception)
		}
	}

	getDirFiles(_path) {
		const files = [];
		try {
			const dirs = fs.readdirSync(_path);
			for (let i = 0; i < dirs.length; ++i) {
				const temp = path.join(_path, dirs[i]);
				if (fs.lstatSync(temp).isDirectory()) files.push(...this.getDirFiles(temp));
				else files.push(temp);
			}
			return files;
		} catch (exception) {
			return [];
		}
	}
	unlink(_path, callback?) {
		fs.unlink(_path, callback)
	}
}
