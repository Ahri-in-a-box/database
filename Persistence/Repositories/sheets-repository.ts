import { Op } from "sequelize";
import { Nullable } from "../../Business/Dependencies/utils";
import { database } from "../database";
import { Repository } from "../Dependencies/repository";
import { Sheet, SheetModel } from "../Entities/sheet";

type UpdateSheetCommand = {
    name?: string,
    description?: Nullable<string>,
    link?: string,
    image?: Nullable<string>,
    usage?: Nullable<string>
};

class SheetsRepository extends Repository {
    public async exists(sheetId: string): Promise<boolean> {
        return await this._dbContext.Sheets.count({ where: { id: sheetId } }) > 0;
    }

    public async getSheets(getSheetsCommand: {
        tags?: string[],
        limit: number,
        last?: string
    }): Promise<Sheet[]> {
        console.log(getSheetsCommand.tags);
        let sheets: Sheet[] = await this._dbContext.Sheets.findAll({
            include: {
                model: this._dbContext.Tags,
                as: "tags",
                attributes: ["wording"],
                through: { attributes: [] }
            },
            order: [["createdAt", "DESC"]],
        }).then(x => x.map(sheet => sheet.dataValues));

        if (getSheetsCommand.last != null) {
            const index: number = sheets.findIndex(sheet => sheet.id === getSheetsCommand.last);
            sheets = sheets.slice(index + 1);
        }

        if (getSheetsCommand.tags != null) {            
            sheets = sheets.filter(sheet => getSheetsCommand.tags!.every(tag => sheet.name.toLowerCase().includes(tag) || sheet.tags!.some(t => t.wording === tag)));
        }

        return sheets.slice(0, getSheetsCommand.limit);
    }

    public async getSheet(sheetId: string): Promise<Nullable<Sheet>> {
        return await this._dbContext.Sheets.findOne({ include: { model: this._dbContext.Tags, as: "tags", attributes: ["wording"], through: { attributes: [] } }, where: { id: sheetId } })
            .then(x => x?.dataValues ?? null);
    }

    public async createSheet(createSheetCommand: {
        name: string;
        description?: string;
        link?: string;
        image?: string;
        usage?: string;
    }): Promise<Nullable<string>> {
        return await this._dbContext.Sheets.create<SheetModel>(createSheetCommand).then(x => x.dataValues.id);
    }

    public async updateSheet(sheetId: string, updateSheetCommand: UpdateSheetCommand): Promise<void> {
        const sheet: Sheet = (await this.getSheet(sheetId))!;

        const updatedFields: (keyof (Sheet | UpdateSheetCommand))[] = Object.keys(updateSheetCommand)
            .map(key => key as keyof (Sheet | UpdateSheetCommand));

        updatedFields.forEach(x => sheet[x] = updateSheetCommand[x]!);
        await this._dbContext.Sheets.update(sheet, { where: { id: sheetId } });
    }

    public async removeSheets(sheetId: string): Promise<void> {
        await this._dbContext.Sheets.destroy({ where: { id: sheetId } });
    }
}

export const sheetsRepository: SheetsRepository = new SheetsRepository(database);
export { SheetsRepository };