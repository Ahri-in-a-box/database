import { DataTypes, ModelAttributes } from "sequelize";
import { Entity } from "../Dependencies/entity";
import { Optional } from "../../Business/Dependencies/utils";
import { Tag } from "./tag";

type Sheet = {
    id: string;
    name: string;
    description: Optional<string>;
    link: string;
    image: Optional<string>;
    usage: Optional<string>;
    tags: Optional<Tag[]>;
    createdAt: Date;
    updatedAt: Date;
}

class SheetModel extends Entity {
    public static readonly name: string = "Sheets";
    public static readonly definition: ModelAttributes = {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        link: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true
        },
        usage: {
            type: DataTypes.STRING,
            allowNull: true
        }
    };
    declare public readonly dataValues: Sheet;
}

export const entity: typeof SheetModel = SheetModel;
export { SheetModel, Sheet };