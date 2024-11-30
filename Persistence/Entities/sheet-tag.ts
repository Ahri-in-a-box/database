import { DataTypes, ModelAttributes, ModelOptions } from "sequelize";
import { Entity } from "../Dependencies/entity";

type SheetTag = {
    sheetId: string;
    tagId: string;
}

class SheetTagModel extends Entity {
    public static readonly name: string = "SheetTags";
    public static readonly definition: ModelAttributes = {
        sheetId: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            references: { model: 'Sheets', key: 'id' }
        },
        tagId: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            references: { model: 'Tags', key: 'id' }
        }
    };
    public static readonly modelOptions: ModelOptions<SheetTagModel> = {
        createdAt: false,
        updatedAt: false
    };
    declare public readonly dataValues: SheetTag;
}

export const entity: typeof SheetTagModel = SheetTagModel;
export { SheetTagModel, SheetTag };