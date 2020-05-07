import nodemailer from "nodemailer";
import MailOptions from "./base/MailOptions";

declare var config: any;
export default class NodeMailer {
	private _transporter = null;
	createTransport() {
		if (!config.NODE_MAILER.HOST) return new Error("Node mailer host required.");
		if (!config.NODE_MAILER.AUTH.USER) return new Error("Node mailer user auth required.");
		if (!config.NODE_MAILER.AUTH.PASS) return new Error("Node mailer user pass required.");
		// this._transporter = nodemailer.createTransport({
		return nodemailer.createTransport({
			host: 'smtp.googlemail.com', // Gmail Host
			port: config.NODE_MAILER.PORT, // Port
			auth: {
				user: config.NODE_MAILER.AUTH.USER,
				pass: config.NODE_MAILER.AUTH.PASS
			}
		});
	}

	sendMail(mail_options: MailOptions, callback: (error, info) => void) {
		this._transporter = this.createTransport();
		this._transporter.sendMail(mail_options, callback);
	}

	verify() {
		this._transporter.verify(function(error, success) {
			if (error) {
				console.log(error);
			} else {
				console.log("Server is ready to take our messages");
			}
		});
	}

	get transporter() {
		return this._transporter;
	}
}
