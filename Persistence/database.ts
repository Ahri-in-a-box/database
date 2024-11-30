import { readdirSync } from "fs";
import { ModelStatic, Sequelize } from "sequelize";
import { Entity } from "./Dependencies/entity";
import { SheetModel } from "./Entities/sheet";
import { TagModel } from "./Entities/tag";
import { SheetTagModel } from "./Entities/sheet-tag";

interface IDatabase {
    Sheets: ModelStatic<SheetModel>;
    Tags: ModelStatic<TagModel>;
    SheetTags: ModelStatic<SheetTagModel>;
}

class Database implements IDatabase {
    private readonly _engine: Sequelize = new Sequelize('database', 'user', 'password', {
        host: 'localhost',
        dialect: 'sqlite',
        logging: false,
        storage: '../database.sqlite',
    });

    public readonly Sheets!: ModelStatic<SheetModel>;
    public readonly Tags!: ModelStatic<TagModel>;
    public readonly SheetTags!: ModelStatic<SheetTagModel>;


    constructor() {        
        readdirSync(`./Persistence/Entities/`)
            .filter(d => d.endsWith('.js'))
            .map(file => require(`./Entities/${file}`).entity)
            .filter(e => e.constructor.prototype.isPrototypeOf(Entity))
            .forEach(e => (this as any)[e.name] = this._engine.define(e.name, e.definition, e.modelOptions));

        this.Sheets.belongsToMany(this.Tags, { through: this.SheetTags, as: 'tags', foreignKey: 'sheetId' });
        this.Tags.belongsToMany(this.Sheets, { through: this.SheetTags, as: 'sheets', foreignKey: 'tagId' });

        this.SheetTags.belongsTo(this.Sheets, { foreignKey: 'sheetId' });
        this.SheetTags.belongsTo(this.Tags, { foreignKey: 'tagId' });

        this.Sheets.hasMany(this.SheetTags, { foreignKey: 'sheetId' });
        this.Tags.hasMany(this.SheetTags, { foreignKey: 'tagId' });

        //this._engine.sync({ alter: true });
        this._engine.sync();
    }
}

export const database: Database = new Database();
export { IDatabase, Database };