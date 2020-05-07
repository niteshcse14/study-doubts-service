export default class Logger {
    static log(request, response, next) {
        console.log(request.method, request.path, new Date());
        next();
    }
}
