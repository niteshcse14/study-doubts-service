import MongoDBModel from '../libs/mongo/lib/MongoDBModel';

export default class UserAskedQuestion extends MongoDBModel {

	static get Schema() {
		return mongoose => ({
			user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
			question: { type: String, trim: true, required: true },
		});
	}
}
