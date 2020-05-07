declare var services: any, config: any;

export default class SaveInformation {
    static async saveRequest(request, response, next) {
        if (!!process.env.DATABASE_URL) {
            request.model = config.MODELS.REQUEST;
            const keys = ['method', 'protocol', 'ip', 'ips', 'path', 'query', 'params', 'rawHeaders', 'hostname', 'url', 'body', 'headers'];
            // const data = services.util_services.extractTargetData(keys, request), obj = {};
            const obj = {};
            for (let i = 0; i < keys.length; ++i) obj[keys[i]] = request[keys[i]];
            const resp = await services.collection.insert(request, response, { data: obj });
            if (resp) {
                request.save_response_with_id = resp[config.FIELDS._ID];
                next();
            }
            else next(resp);
        }
        else next();
    }
}
