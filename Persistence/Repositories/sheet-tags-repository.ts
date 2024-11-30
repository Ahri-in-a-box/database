import { database } from "../database";
import { Repository } from "../Dependencies/repository";

class SheetTagsRepository extends Repository {
    public async addSheetTags(sheetId: string, tagIds: string[]): Promise<void> {
        this._dbContext.SheetTags.bulkCreate(tagIds.map(t => ({ sheetId, tagId: t })));
    }

    public async updateSheetTags(sheetId: string, tagIds: string[]): Promise<void> {
        await this.removeSheetTags(sheetId);
        await this.addSheetTags(sheetId, tagIds);
    }

    public async removeSheetTags(sheetId: string): Promise<void> {
        this._dbContext.SheetTags.destroy({ where: { sheetId } });
    }
}

export const sheetTagsRepository: SheetTagsRepository = new SheetTagsRepository(database);
export { SheetTagsRepository };