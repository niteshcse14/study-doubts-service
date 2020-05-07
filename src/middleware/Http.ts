declare var services: any, _db: any, middleware: any, config: any;
export default class Http {
    static urlNotFound(request, response, next) {
        middleware.response.sendResponse(request, response, middleware.response.urlNotFound)
    }

    static serverError(request, response, next) {
        middleware.response.sendResponse(request, response, config.GENERIC)
    }

    static validateRequest(request, response, next) {
        let config_obj = config.EXPRESS[request.method.toLowerCase() + request.path], params_keys = Object.keys(request.params);
        if (params_keys.length) {
            config_obj = config.EXPRESS[request.method.toLowerCase() + request.path.replace(request.params[params_keys[0]], ":" + params_keys[0])];
        }
        if (!config_obj || !config_obj.model) return Http.urlNotFound(request, response, next);
        else request.model = config_obj.model;
        if (request.method != config.METHOD.POST && request.method != config.METHOD.GET) {
            config_obj.params = config.application.params;
        }
        request._config = config_obj;
        if (config_obj && config_obj.hasPermission === false && !this.isValidUser(request, response)) return response.status(config.FORBIDDEN.code).send(config.getResponse(config.FORBIDDEN));
        const keys = ["query", "params", "body"], errors = [];
        for (let i = 0; i < keys.length; ++i) {
            if (!config_obj[keys[i]]) continue;
            errors.push(...middleware.fields.initUtil(request[keys[i]], config_obj[keys[i]]));
        }
        if (errors.length) return middleware.response.sendResponse(request, response, { ...config.getApiResponse("FAILED"), errors: errors });
        const non_updatable_fields_error = [];
        if (!!config_obj.permissionDeniedToUpdate) non_updatable_fields_error.push(...middleware.non_updatable_fields.init(request, config_obj.permissionDeniedToUpdate));
        if (non_updatable_fields_error.length) return middleware.response.sendResponse(request, response, { ...config.getApiResponse("FORBIDDEN"), errors: non_updatable_fields_error });
        else next();
    }

    static async callback(request, response, next) {
        let response_obj: any = { ...config.getApiResponse(config.API_RESPONSE.BAD_REQUEST) }, resp: any = {}, model_validation = middleware.validations ? middleware.validations[request.model] : null;
        try {
            if (!!model_validation && !!model_validation[request._config.next]) resp = await model_validation[request._config.next](request, response);
            else if (!!model_validation && !!model_validation[request.method.toLowerCase()]) resp = await model_validation[request.method.toLowerCase()](request, response);
            else if (!!middleware.validations[request.method.toLowerCase()]) resp = await model_validation[request.method.toLowerCase()](request, response);
            else resp = await services.collection[config.MONGO_DOC[request.method]](request, response);
            await services.collection.update({
                model: config.MODELS.REQUEST,
                body: { response: resp },
                query: { _id: request.save_response_with_id }
            }, {});
            if (resp && !(resp instanceof Error)) {
                response_obj = {
                    code: config.SUCCESS_CODE[request.method],
                    status: config.SUCCESS_STATUS[request.method],
                    message: config.SUCCESS_MESSAGE[request.method]
                };
                response_obj.data = resp;
                middleware.response.sendResponse(request, response, response_obj);
            } else if (resp === null) Http.urlNotFound(request, response, {});
            else throw new Error(resp ? resp.message : "Undefined Data");
        } catch(exception) {
            try {
                if (Array.isArray(exception.message)) response_obj.errors = exception.message;
                else response_obj = { ...response_obj, ...JSON.parse(exception.message) };
            } catch(err) {
                response_obj.errors = [config.getApiErrorResponse(config.API_RESPONSE.BAD_REQUEST, null, exception.message)];
            }
            middleware.response.sendResponse(request, response, response_obj);
        }
    }

    private static isValidUser(request, response) {
        if (!request.headers.authorization) return false;
        let authentication = request.headers.authorization.replace(/^Basic/, '');
        authentication = (Buffer.from(authentication, 'base64')).toString('utf8');
        const login_info = authentication.split(':');
        return !(login_info.length < 2 || login_info[0] !== "abc" || login_info[1] !== "abc");
    }
}
