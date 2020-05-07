import express from 'express'
import multer from 'multer'
import * as bodyParser from 'body-parser';
const upload = multer();

declare var config: any, middleware: any;
export default class ServerConnection {
    _app: any;
    constructor() {
        this._app = express();
        this.listen();
    }

    /**
     * addSafeReadOnlyGlobal : defining property
     *
     * @author Nitesh <nitesh.nituk14@gmail.com>
     *
     */

    private listen(): void {
        this._app.listen(config.PORT, err => {
            if (err) throw new Error(err);
            console.log("server active on PORT : " + config.PORT)
        });
        this.activeRoutes();
    }

    /**
     * addSafeReadOnlyGlobal : defining property
     *
     * @author Nitesh <nitesh.nituk14@gmail.com>
     *
     */

    private activeRoutes(): void {
        this._app.use(bodyParser.urlencoded({ extended: false }));
        this._app.use(bodyParser.json());
        this._app.use(upload.array());
        this._app.use(middleware.save_information.saveRequest, middleware.logger.log);
    }

    /**
     * app : returning app
     *
     * @author Nitesh <nitesh.nituk14@gmail.com>
     */

    get app(): void {
        return this._app;
    }
}
