import { Database } from "../database";

abstract class Repository {
    protected readonly _dbContext: Database;

    constructor(dbContext: Database) {
        this._dbContext = dbContext;
    }
}

export { Repository };