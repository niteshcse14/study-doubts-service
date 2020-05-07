export default class QuestionTable {
	static getHtml() {
		return {
			"1": {
				"_config": {},
				"tag": "div",
				"parent": -1
			},
			"2": {
				"_config": {},
				"tag": "h2",
				"parent": 1,
				"html": "Related Questions"
			},
			"3": {
				"_config": {},
				"tag": "table",
				"parent": 1
			},
			"4": {
				"_config": {},
				"tag": "tbody",
				"parent": 3
			},
			"5": {
				"_config": {},
				"tag": "tr",
				"parent": 4
			},
			"6": {
				"_config": {},
				"tag": "th",
				"parent": 5,
				"html": "S.N."
			},
			"7": {
				"_config": {},
				"tag": "th",
				"parent": 5,
				"html": "Question"
			}
		};
	}
}
