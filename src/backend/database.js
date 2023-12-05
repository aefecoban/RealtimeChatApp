const knex = require("knex")
const u = require("./models/User");
const m = require("./models/Message");

module.exports = class Database{

    Models = {};

    constructor(){
        this.DB = knex({
            client : "sqlite3",
            connection : {
                filename : "./database.db"
            }
        });

        this.Models = {
            Users : new u(this.DB),
            Messages : new m(this.DB),
        }
    }

    async Boot(){
        await this.Models.Users.Create();
        await this.Models.Messages.Create();
    }

}