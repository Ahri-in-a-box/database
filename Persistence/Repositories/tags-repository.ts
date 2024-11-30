import { Op } from "sequelize";
import { database } from "../database";
import { Repository } from "../Dependencies/repository";

class TagsRepository extends Repository {
    public async getTagIds(wordings: string[]): Promise<string[]> {
        return await this._dbContext.Tags.findAll({ where: { wording: { [Op.in]: wordings } }, attributes: ['id'] })
            .then(x => x.map(t => t.dataValues.id));
    }

    private async getExistingTagWordings(wordings: string[]): Promise<string[]> {
        return await this._dbContext.Tags.findAll({ where: { wording: { [Op.in]: wordings } }, attributes: ['wording'] })
            .then(x => x.map(t => t.dataValues.wording));
    }

    public async addMissingTags(wordings: string[]): Promise<string[]> {
        wordings = wordings.map(w => w.toLowerCase());
        const existingsWordings: string[] = await this.getExistingTagWordings(wordings);
        wordings = wordings.filter(w => !existingsWordings.includes(w));

        return await this._dbContext.Tags.bulkCreate(wordings.map(w => ({ wording: w })))
            .then(x => x.map(t => t.dataValues.id));
    }
    
    public async removeUnusedTags(): Promise<void> {
        const usedTagIds: string[] = await this._dbContext.SheetTags.findAll({ attributes: ['tagId'] }).then(x => x.map(t => t.dataValues.tagId));
        await this._dbContext.Tags.destroy({ where: { id: { [Op.notIn]: usedTagIds } } });
    }
}

export const tagsRepository: TagsRepository = new TagsRepository(database);
export { TagsRepository };