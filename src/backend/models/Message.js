const Model = require("./Model");

module.exports = class User extends Model{

    TableName = "Messages";

    constructor(DB){
        super(DB);
    }

    async Create(){
        let exists = await this.DB.schema.hasTable(this.TableName)
        if(!exists){
            await this.DB.schema.createTable(this.TableName, (table) => {
                table.increments("ID").primary();
                table.integer("AuthorID").unsigned();
                table.foreign("AuthorID").references('Users.ID');
                table.string("Message");
            })
        }
    }

}