import { Model, ModelAttributes, ModelOptions } from "sequelize";

abstract class Entity extends Model {
    public static readonly name: string;
    public static readonly definition: ModelAttributes;
    public static readonly modelOptions?: ModelOptions<any>;
}

export { Entity };