export default class MailTemplate {
	static getHtml() {
		return {
			"1": {
				"_config": {
					"width": "652",
					"border": "0",
					"cellspacing": "0",
					"cellpadding": "0",
					"align": "center",
					"style": "font-family:Arial, Helvetica, sans-serif; color:#4a4a4a; border:solid 2px #E77817;"
				},
				"tag": "table",
				"parent": -1
			},
			"2": {
				"_config": {},
				"tag": "tbody",
				"parent": 1
			},
			"3": {
				"_config": {},
				"tag": "tr",
				"parent": 2
			},
			"4": {
				"_config": {
					"style": "padding:0px 20px 20px 20px;"
				},
				"tag": "td",
				"parent": 3
			},
			"5": {
				"_config": {
					"width": "100%",
					"border": "0",
					"cellspacing": "0",
					"cellpadding": "0",
					"style": "text-align:left;"
				},
				"tag": "table",
				"parent": 4
			},
			"6": {
				"_config": {},
				"tag": "tbody",
				"parent": 5
			},
			"7": {
				"_config": {},
				"tag": "tr",
				"parent": 6
			},
			"8": {
				"_config": {
					"style": "padding-bottom:10px; padding-top:30px;"
				},
				"tag": "td",
				"parent": 7
			},
			"9": {
				"_config": {
					"style": "color:#4a4a4a; font-size:12px; line-height:20px; font-family:Arial, Helvetica, sans-serif; margin:0 0 15px 0; padding:0 0 0 0; text-align:left; text-transform: capitalize;"
				},
				"tag": "p",
				"parent": 8,
				"html": "Dear {name},"
			},
			"10": {
				"_config": {
					"style": "color:#4a4a4a; font-size:12px; line-height:20px; font-family:Arial, Helvetica, sans-serif; margin:0 0 15px 0; padding:0 0 0 0; text-align:left;"
				},
				"tag": "p",
				"parent": 8,
				"html": "This is a reminder that we have attached related questions for you for your dout clarification."
			},
			"11": {
				"_config": {
					"href": "data:application/pdf;base64,",
					"download": 'questions.pdf',
					"style": "color: blue"
				},
				"tag": "a",
				"parent": 8,
				"html": "Click here"
			},
			"12": {
				"_config": {
					"style": "color:#4a4a4a; font-size:12px; line-height:20px; font-family:Arial, Helvetica, sans-serif; margin:0 0 15px 0; padding:0 0 0 0; text-align:left;"
				},
				"tag": "p",
				"html": "To download PDF.\n{html}",
				"parent": 8
			},
			"13": {
				"_config": {},
				"tag": "br",
				"parent": 12,
				"html": ""
			},
			"14": {
				"_config": {
					"style": "color:#4a4a4a; font-size:12px; line-height:20px; font-family:Arial, Helvetica, sans-serif; margin:0 0 15px 0; padding:0 0 0 0; text-align:left;"
				},
				"tag": "p",
				"html": "Sincerely,<br>",
				"parent": 8
			},
			"15": {
				"_config": {},
				"tag": "b",
				"parent": 14,
				"html": "Doubtnut"
			}
		};
	}
}
