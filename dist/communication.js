const Wsocket = require("ws");

module.exports = class Communication{
    
    ws;
    storage;
    DB;
    SM;

    constructor(Database, SessionManager){
        this.ws = new Wsocket.Server({ port : 8080 });
        this.storage = [];
        this.DB = Database;
        this.SM = SessionManager;
    }

    async Start(){

        let buff = await this.DB.Models.Messages.SelectAll();
        let buff2 = await this.DB.Models.Users.SelectAll();

        if(buff != null && buff2 != null){
            buff.map((b, index) => {
                buff[index].Author = (buff2.find((b2) => b2.ID == b.AuthorID)).Username ?? "[deleted]";
                if(buff[index].AuthorID)
                    delete buff[index].AuthorID;
            });
    
            this.storage = buff;
        }

        this.ws.on("connection", (socket) => {

            socket.send(JSON.stringify({Message : this.storage}));

            socket.on("message", async (msg) => {
                msg = msg.toString('utf-8'); 
                msg = JSON.parse(msg ?? "{}");
                console.log("mesaj geldi", msg);

                if(msg.Key != null && msg.Message != null){
                    let ID = this.SM.GetSession(msg.Key);
                    if(ID == null) return;

                    let data = await this.DB.Models.Users.Select({ID : ID});
                    if(data != null){
                        await this.DB.Models.Messages.Insert({AuthorID : data.ID, Message : msg.Message})
                        msg = { Author : data.Username, Message : msg.Message };
                        this.storage.push(msg);
                        this.ws.clients.forEach((client) => {
                            console.log("mesaj yayınlandı");
                            client.send(JSON.stringify(msg));
                        });
                    }
                }
            })
        });

        console.log("Web Socket Server started. Listening on port 8080");
    }

}