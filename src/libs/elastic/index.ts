// import elasticsearch from "elasticsearch";

declare var config: any;
export default class ElasticSearch {
	client: any;
	constructor() {
		this.initializeElastic();
	}

	initializeElastic() {
		/*this.client = new elasticsearch.Client({
			host: config.ELASTIC_URL,
			log: "trace",
			apiVersion: '7.2',
		});*/
	}
}
