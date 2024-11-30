import { readdirSync } from "fs";

class Handler<T extends object> {
    public readonly elements: { [key: string]: T } = {};

    protected getRequires(baseFolder: string, subFolders: string, property: string) : any[] {
        const handledElements = readdirSync(`./${baseFolder}/${subFolders}/`).filter(d => d.endsWith('.js'));

        return handledElements.map(element => require(`../../${baseFolder}/${subFolders}/${element}`)[property]);
    }

    public get(elementName: string): T {
        return this.elements[elementName];
    }

    public getElements(): T[] {
        return Object.values(this.elements);
    }

    public add(element: T): this {
        this.elements[element.constructor.name] = element;
        return this;
    }

    public remove(elementName: string): this {
        delete this.elements[elementName];
        return this;
    }
}

export default Handler;