import MongoDBModel from '../libs/mongo/lib/MongoDBModel';

export default class Request extends MongoDBModel {

    static get Schema() {
        return mongoose => ({
            method: { type: String, trim: true, required: true },
            status: { type: String, trim: true },
            protocol: { type: String, trim: true },
            ip: { type: String, trim: true, required: true },
            ips: { type: Array },
            path: { type: String, trim: true, required: true },
            query: { type: Object },
            params: { type: Object },
            rawHeaders: { type: Object },
            hostname: { type: String, trim: true },
            url: { type: String, trim: true, required: true },
            code: { type: Number },
            body: { type: Object },
            headers: { type: Object, required: true },
            response: { type: mongoose.Schema.Types.Mixed, default: {} },
        });
    }

    static get Indexes() {
        return ["method", "ip", "url"];
    }
}
