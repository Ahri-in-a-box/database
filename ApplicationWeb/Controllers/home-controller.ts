import { Controller } from "../Dependencies/controller";
import { RouteDescription } from "../Dependencies/route-description";

class HomeController extends Controller {
    protected readonly routes: RouteDescription[] = [
        new RouteDescription("GET", "/", this.index.bind(this)),
        new RouteDescription("GET", "/ping", this.pong.bind(this)),
    ];

    private index(req: any, res: any): void {
        this.view(res, "index");
    }

    private pong(req: any, res: any): void {
        res.status(200).send("pong");
    }

    public addRoutes(app: any): void {
        super.addRoutes(app);

        app.use((req: any, res: any, next: any) => {
            req.path.replace("..", "");
            if(req.path != "/favicon.ico") {
                this.send(res, req.path);
            }
        });
    }
}

export const controller: HomeController = new HomeController();
export { HomeController };