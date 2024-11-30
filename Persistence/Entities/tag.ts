import { DataTypes, ModelAttributes, ModelOptions } from "sequelize";
import { Entity } from "../Dependencies/entity";

type Tag = {
    id: string;
    wording: string;
}

class TagModel extends Entity {
    public static readonly name: string = "Tags";
    public static readonly definition: ModelAttributes = {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        wording: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    };
    public static readonly modelOptions: ModelOptions<TagModel> = {
        createdAt: false,
        updatedAt: false
    };
    declare public readonly dataValues: Tag;
}

export const entity: typeof TagModel = TagModel;
export { TagModel, Tag };