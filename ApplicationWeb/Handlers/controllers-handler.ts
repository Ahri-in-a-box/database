import { Controller } from "../Dependencies/controller";
import Handler from "../../Business/Dependencies/handler";

class ControllersHandler extends Handler<Controller> {
    public loadControllers(): this {
        this.getRequires("ApplicationWeb", "Controllers", "controller")
            .filter(x => x instanceof Controller)
            .forEach(controller => this.add(controller));
        return this;
    }
}

export default ControllersHandler;