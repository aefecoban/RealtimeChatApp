const crypto = require("crypto");

module.exports = class SessionManager{

    Sessions = {};

    constructor(){
        this.Sessions = {};
    }

    GetSession(key){
        return this.Sessions[key] ?? null;
    }

    SetSession(userID){
        let key = this.CreateKey(userID);
        this.Sessions[key] = userID;
        return key;
    }

    RemoveSession(key){
        if(this.Sessions[key])
            delete this.Sessions[key];
    }

    CreateKey(userID){
        if(typeof(userID) != typeof(""))
            userID = userID.toString();
        return crypto.createHash("sha256").update(userID).digest("hex");
    }

}