import { join } from 'path';
import fs from 'fs';
import ApiRoutes from '../routes/ApiRoutes';

declare var middleware: any, services: any, config: any;
export default class App extends ApiRoutes {
    constructor() {
        super();
        // fs.writeFileSync(join(config.app_base_dir, "export", "api.json"), JSON.stringify(this.end_points, null, 4), "utf-8");
        this.serverAndResourceNotFoundError();
    }

    /**
     * serverAndResourceNotFoundError : not found and server error
     *
     * @author Nitesh <nitesh.nituk14@gmail.com>
     *
     */
    serverAndResourceNotFoundError() {
        this._app.use(middleware.http.urlNotFound);
        this._app.use(middleware.http.serverError);
    }
}
