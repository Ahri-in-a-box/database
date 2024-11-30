class RouteDescription {
    public readonly method: string;
    public readonly path: string;
    public readonly handler: (req: any, res: any) => any;

    constructor(method: string, path: string, handler: (req: any, res: any) => any) {
        this.path = path;
        this.method = method;
        this.handler = handler;
    }
}

export { RouteDescription };