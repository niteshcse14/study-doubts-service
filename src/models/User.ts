import MongoDBModel from '../libs/mongo/lib/MongoDBModel';

export default class User extends MongoDBModel {

	static get Schema() {
		return mongoose => ({
			name: { type: String, trim: true, required: true },
			email: { type: String, trim: true, required: true },
			phone_number: { type: String, trim: true, required: true },
			class: { type: Number, trim: true, required: true, min: 1, max: 12 },
			address: { type: String, trim: true, required: true }
		});
	}

	static get Indexes() {
		return ["email", "phone_number"];
	}
}
