import http from 'http';
import https from 'https';

import express from 'express';
import compression from 'compression';
import serveStatic from 'serve-static';

import { readFileSync } from "fs";
import config from "./config.json";

import ControllersHandler from "./Handlers/controllers-handler";
import { Controller } from "./Dependencies/controller";
import { HomeController } from './Controllers/home-controller';

interface ITlsConfig {
    key: string;
    cert: string;
}

interface IServerConfig {
    port: number;
    httpsPort: number;
    useTls: boolean;
    redirectToHttps: boolean;
    tls?: ITlsConfig;
}

class Server {
    public readonly port: number;
    public readonly httpsPort: number;
    public readonly useTls: boolean;
    public readonly redirectToHttps: boolean;
    public readonly tls?: ITlsConfig;
    private readonly tlsConfig?: { key: Buffer; cert: Buffer };

    constructor({ port, httpsPort, useTls, redirectToHttps, tls }: IServerConfig) {
        this.port = port;
        this.httpsPort = httpsPort;
        this.useTls = useTls;
        this.redirectToHttps = redirectToHttps;
        this.tls = tls;

        if(this.useTls) {
            if(!this.tls?.key || !this.tls?.cert) {
                throw new Error("Missing TLS configuration.");
                
            }

            this.tlsConfig = {
                key: readFileSync(this.tls.key),
                cert: readFileSync(this.tls.cert)
            };
        }
    }

    private static sortControllers(a: Controller, b: Controller): number {
        if(a instanceof HomeController) {
            return b instanceof HomeController ? 0 : 1;
        }
        
        return b instanceof HomeController ? -1 : 0;
    }

    public start() {
        const app = express();
        app.use(express.json());
        app.use(compression());
        app.use(serveStatic(__dirname + '/../../ApplicationWeb' + '/wwwroot'));

        app.set('views', __dirname + '/../../ApplicationWeb' + '/Views');
        app.set('view engine', 'ejs');

        const controllersHandler = new ControllersHandler();
        controllersHandler.loadControllers();
        controllersHandler.getElements().sort(Server.sortControllers).forEach((controller: Controller) => controller.addRoutes(app));

        const httpServer = http.createServer(app);
        const httpsServer = config.useTls ? https.createServer(this.tlsConfig!, app) : undefined;

        httpServer.listen(this.port);
        httpsServer?.listen(this.httpsPort);
    }
}

export const server: Server = new Server(config);
export { ITlsConfig, IServerConfig, Server };