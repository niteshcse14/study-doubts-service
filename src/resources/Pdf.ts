import ServiceDocument from "service-document";
import QuestionTable from "../templates/QuestionTable";
import MailTemplate from "../templates/MailTemplate";
import cron from "node-cron";
import CronJob from "../services/CronJob";

declare var config: any, services: any;
export default class Pdf {
	private static task: any;
	static async post(request, response) {
		if (this.task) this.task.destroy();
		const _self = this;
		this.task = cron.schedule('*/5 * * * *', () => _self.postUtil(request, response));
		return {
			message: "Task has been scheduled. Please check your email after 5 minute for more related questions PDF."
		};
	}

	static async postUtil(request, response) {
		if (this.task) this.task.destroy();
		const html_json = QuestionTable.getHtml(), pre_model = request.model;
		request.model = config.MODELS.CATALOG_QUESTIONS;
		request.query = request.params = {};
		const data = await services.collection.find(request, response);
		const user = await services.collection.find({
			model: config.MODELS.USER,
			query: { _id: request.body.user_id }
		}, response);
		if (!user || !user.length) return new Error("User not exist for given user_id : " + request.body.user_id);
		let node = 8;
		for (let i = 0; i < data.length; ++i) {
			let pre_node = node;
			html_json[node++] = {
				"_config": {},
				"tag": "tr",
				"parent": node - 4
			};
			html_json[node++] = {
				"_config": {},
				"tag": "td",
				"parent": pre_node,
				"html": (i + 1).toString()
			};
			html_json[node++] = {
				"_config": {},
				"tag": "td",
				"parent": pre_node,
				"html": data[i].question
			};
		}
		let questions_html = ServiceDocument.jsonToHtml(html_json), mail_template = MailTemplate.getHtml();
		const base64 = await ServiceDocument.htmlToPdf().getBase64(questions_html);
		mail_template["11"]._config.href += base64;
		let html = ServiceDocument.jsonToHtml(mail_template, { ...user[0], html: questions_html });
		request.model = pre_model;
		const mail_option = {
			to: user[0].email,
			from: config.NODE_MAILER.FROM,
			subject: "Questions are related to " + request.body.question,
			html: html,
		};
		services.node_mailer.sendMail(mail_option, (err, info) => {});
		return {
			message: "Successfully E-mail sent on your registered E-mail Id.",
			mail_html: mail_option.html,
			base64: base64
		};
	}
}
