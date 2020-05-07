interface query {
	alias: String;
	expands: String;
	d_fields: String;
	fields: String;
	sort_by?: any;
	limit?: Number;
	start?: Number;
}

export default class Query {
	params?: {};
	headers?: {};
	query?: query;
	alias?: String;
	fields?: String;
	d_fields?: String;
}
