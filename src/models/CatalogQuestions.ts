import MongoDBModel from '../libs/mongo/lib/MongoDBModel';

export default class CatalogQuestions extends MongoDBModel {

	static get Schema() {
		return mongoose => ({
			question: { type: String, trim: true, required: true },
			chapter: { type: String, trim: true, required: true },
		});
	}
}
