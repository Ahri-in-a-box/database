import { Nullable } from "../../Business/Dependencies/utils";
import { Sheet } from "../../Persistence/Entities/sheet";
import { sheetTagsRepository, SheetTagsRepository } from "../../Persistence/Repositories/sheet-tags-repository";
import { sheetsRepository, SheetsRepository } from "../../Persistence/Repositories/sheets-repository";
import { tagsRepository, TagsRepository } from "../../Persistence/Repositories/tags-repository";
import { Controller } from "../Dependencies/controller";
import { RouteDescription } from "../Dependencies/route-description";
import { SheetViewModel } from "../Models/Sheets/sheet-view-model";

class SheetsController extends Controller {
    private static readonly _baseRoute = "/sheets";
    protected readonly routes: RouteDescription[] = [
        new RouteDescription("GET", SheetsController._baseRoute, this.getSheets.bind(this)),
        new RouteDescription("GET", SheetsController._baseRoute + "/getSheets", this.showSheets.bind(this)),
        new RouteDescription("GET", SheetsController._baseRoute + "/:sheetId", this.getSheet.bind(this)),
        new RouteDescription("POST", SheetsController._baseRoute, this.createSheet.bind(this)),
        new RouteDescription("PUT", SheetsController._baseRoute, this.createSheet.bind(this)),
        new RouteDescription("PATCH", SheetsController._baseRoute + "/:sheetId", this.updateSheet.bind(this)),
        new RouteDescription("DELETE", SheetsController._baseRoute + "/:sheetId", this.deleteSheet.bind(this)),
    ];

    constructor(
        private readonly _sheetsRepository: SheetsRepository,
        private readonly _sheetTagsRepository: SheetTagsRepository,
        private readonly _tagsRepository: TagsRepository
    ) {
        super();
    }

    private async updateSheetTags(sheetId: string, tags: string[]): Promise<void> {
        await this._tagsRepository.addMissingTags(tags);
        tags = await this._tagsRepository.getTagIds(tags);

        await this._sheetTagsRepository.updateSheetTags(sheetId, tags);
        await this._tagsRepository.removeUnusedTags();
    }

    private getSheets(req: any, res: any): void {
        res.status(200).send("pong");
    }

    private async showSheets(req: any, res: any): Promise<void> {
        const getSheetCommand: {
            search?: string,
            limit: number,
            last?: string
        } = req.query;

        if(getSheetCommand.limit == null) {
            res.status(400).send("Limit must be provided");
            return;
        }

        if(getSheetCommand.limit <= 0) {
            res.status(400).send("Limit must be greater than 0");
            return;
        }

        const sheets: Sheet[] = await this._sheetsRepository.getSheets({
            limit: getSheetCommand.limit,
            last: getSheetCommand.last,
            tags: getSheetCommand.search?.split(" ").map(x => x.trim().toLowerCase())
        });
        console.log(sheets);

        this.partialView(res, "sheets", { sheets: sheets.map(sheet => new SheetViewModel(sheet)) });
    }

    private async getSheet(req: any, res: any): Promise<void> {
        const sheetId: string = req.params.sheetId;
        if(sheetId == null) {
            res.status(400).send("SheetId must be provided");
            return;
        }

        const sheet: Nullable<Sheet> = await this._sheetsRepository.getSheet(sheetId);
        if(sheet == null) {
            res.status(400).send("Sheet not found");
            return;
        }

        res.status(200).json(new SheetViewModel(sheet));
    }

    private async createSheet(req: any, res: any): Promise<void> {
        const tags = req.body.tags as string[];
        await this._tagsRepository.addMissingTags(tags);

        const createSheetCommand: {
            name: string,
            description?: string,
            tags: string[],
            link?: string,
            image?: string,
            usage?: string
        } = req.body;

        createSheetCommand.tags = await this._tagsRepository.getTagIds(tags);
        const sheetId: Nullable<string> = await this._sheetsRepository.createSheet(createSheetCommand);
        this._sheetTagsRepository.addSheetTags(sheetId!, createSheetCommand.tags);
        if (sheetId == null) {
            res.status(400).send("Sheet not created");
            return;
        }

        await this._tagsRepository.removeUnusedTags();
        const sheet: Sheet = (await this._sheetsRepository.getSheet(sheetId))!;
        res.status(200).json(new SheetViewModel(sheet));
    }

    private async updateSheet(req: any, res: any): Promise<void> {
        const sheetId: string = req.params.sheetId;
        const updateSheetCommand: {
            name?: string,
            description?: Nullable<string>,
            tags?: string[],
            link?: string,
            image?: Nullable<string>,
            usage?: Nullable<string>
        } = req.body;

        if(!await this._sheetsRepository.exists(sheetId)) {
            res.status(400).send("Sheet not found");
            return;
        }

        await this._sheetsRepository.updateSheet(sheetId, {
            name: updateSheetCommand.name,
            description: updateSheetCommand.description,
            link: updateSheetCommand.link,
            image: updateSheetCommand.image,
            usage: updateSheetCommand.usage
        });

        if(updateSheetCommand.tags != null) {
            await this.updateSheetTags(sheetId, updateSheetCommand.tags);
        }

        const sheet: Sheet = (await this._sheetsRepository.getSheet(sheetId))!;
        res.status(200).json(new SheetViewModel(sheet));
    }

    private async deleteSheet(req: any, res: any): Promise<void> {
        const sheetId: string = req.params.sheetId;
        if(!await this._sheetsRepository.exists(sheetId)) {
            res.status(400).send("Sheet not found");
            return;
        }

        await this._sheetsRepository.removeSheets(sheetId);
        await this._tagsRepository.removeUnusedTags();

        res.status(200).send();
    }
}

export const controller: SheetsController = new SheetsController(sheetsRepository, sheetTagsRepository, tagsRepository);
export { SheetsController };