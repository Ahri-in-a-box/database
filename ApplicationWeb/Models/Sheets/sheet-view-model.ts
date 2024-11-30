import { Optional } from "../../../Business/Dependencies/utils";
import { Sheet } from "../../../Persistence/Entities/sheet";

class SheetViewModel {
    public id: string;
    public name: string;
    public description: Optional<string>;
    public tags: Optional<string[]>;
    public link: string;
    public image: Optional<string>;
    public usage: Optional<string>;

    constructor(sheet: Sheet) {
        this.id = sheet.id;
        this.name = sheet.name;
        this.description = sheet.description;
        this.tags = sheet.tags?.map(t => t.wording);
        this.link = sheet.link;
        this.image = sheet.image;
        this.usage = sheet.usage;
    }
}

export { SheetViewModel };