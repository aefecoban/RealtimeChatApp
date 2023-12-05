module.exports = class Model{

    TableName = "";

    constructor(DB){
        this.DB = DB;
    }

    Select(where){
        return this.DB(this.TableName).where(where).first();
    }

    SelectAll(where = null){
        if(where == null)
            return this.DB(this.TableName);
        else
            return this.DB(this.TableName).where(where);
    }

    Insert(data){
        return this.DB(this.TableName).insert(data);
    }

    Update(where, data){
        return this.DB(this.TableName).where(where).update(data);
    }

    Delete(where){
        return this.DB(this.TableName).where(where).del();
    }

}