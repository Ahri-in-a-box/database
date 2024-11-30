import { existsSync } from "fs";
import { RouteDescription } from "./route-description";
import nav from "../nav.json";
import { appName } from "../config.json";

abstract class Controller {
    protected readonly routes: RouteDescription[] = [];

    public addRoutes(app: any): void {
        this.routes.forEach(route => app[route.method.toLowerCase()]([route.path], route.handler));
    }

    protected send(res: any, path: string) {
        if(existsSync(path)) {
            res.sendFile(path);
        } else {
            res.sendStatus(404);
        }
    }

    protected partialView(res: any, view: string, data?: any): void {
        const controllerName = this.constructor.name.replace("Controller", "");
        if(!view.startsWith('/')) {
            view = `${controllerName}/${view}`;
        }

        res.render(view, data);
    }

    protected view(res: any, view: string, data?: any): void {
        //TODO: Ajouter un algo pour chercher le fichier
        const controllerName = this.constructor.name.replace("Controller", "");
        if(!view.startsWith('/')) {
            view = `${controllerName}/${view}`;
        }

        res.render("Shared/template", {
            view: view,
            data: data,
            nav: nav,
            title: `${appName} - ${controllerName}`,
        });
    }
}

export { Controller }