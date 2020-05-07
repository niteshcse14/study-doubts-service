import path from "path";

declare var config: any;
export default class App {
	routes: any = "routes/api";
	app_base_dir: any = path.join(__dirname, "..");

	URL: string = process.env.HOST + ":" + process.env.PORT;
	IS_DB_STRICT: any = process.env.IS_DB_STRICT !== "false";
	DATABASE_URL: string = process.env.DATABASE_URL;
	USER_URL: any = {};
	NODE_MAILER = {
		FROM: process.env.NODE_MAILER_AUTH_USER,
		HOST: process.env.NODE_MAILER_HOST,
		SECURE: process.env.NODE_MAILER_SECURE === "true",
		PORT: process.env.NODE_MAILER_PORT ? +process.env.NODE_MAILER_PORT : 587,
		AUTH: {
			USER: process.env.NODE_MAILER_AUTH_USER,
			PASS: process.env.NODE_MAILER_AUTH_PASS
		}
	};

	constructor() {
		const env_keys = Object.keys(process.env);
		for (let i = 0; i < env_keys.length; ++i) this[env_keys[i]] = process.env[env_keys[i]];

		this.USER_URL = {
			USERS: process.env.USER_URL + "/v1/users",
			CUSTOMERS: process.env.USER_URL + "/v1/customers"
		};
	}

	getResponse = function (code_obj, status = "FAILED", message = "FAILED") {
		let resp: any = {};
		if (typeof code_obj === "object") resp = code_obj;
		else resp = {
			code: code_obj,
			status: status,
			message: message
		};
		if (!!!config.IS_DB_STRICT) {
			resp.status = resp.status.toLowerCase();
			resp.message = resp.message.toLowerCase();
		}
		return resp;
	}
}
