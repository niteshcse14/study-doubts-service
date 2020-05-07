import request from "request";

export default class Http {
    _request: request;
    init(options) {
        const _self = this;
        return new Promise(function (resolve, reject) {
            return _self.getInstance(options, resolve, reject);
        });
    }

    private getInstance(options, resolve, reject) {
        return this._request = request(options, (e, resp, body) => {
            if (!e) resolve(JSON.parse(body));
            else reject(e);
        });
    }

    get requestObject() {
        return this._request;
    }

    abort() {
        if (this._request) this._request.abort();
        else console.log("No request is available to abort !!");
    }
}
