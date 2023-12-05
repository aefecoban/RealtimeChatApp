const fs = require("fs");
const path = require("path");

module.exports = class Server{

    App;
    DB;
    SM;

    constructor(Database, SessionManager){
        this.App = require("fastify")({
            logger : true
        });
        this.DB = Database;
        this.SM = SessionManager;
    }

    Start(){
        this.MW();
        this.Route();
        this.Listen();
    }

    MW(){
        this.App.register(require("@fastify/cors"), {});
        this.App.register(require("@fastify/formbody"));
        this.App.register(require("@fastify/static"), {
            root : path.join(__dirname, "clientDist/assets"),
            prefix : "/assets/",
        });
    }

    Route(){
        this.App.get("/", (req, res) => {
            let fileLocation = path.join(__dirname, "clientDist/index.html")
            if(fs.existsSync(fileLocation)){
                const index = fs.readFileSync(fileLocation);
                res.type('text/html').send(index);
            }else{
                res.type('text/html').send("<h1>File not found.</h1>");
            }
        });

        this.App.post("/api/register", (req, res) =>{
            let Body = req.body;
            if(Body.Username == null || Body.Password == null){
                res.send({Error : 400, Message : "Missing fields."});
                return;
            }
            this.DB.Models.Users.Select({Username : Body.Username}).then((data) => {
                if(data != null){
                    res.send({Error : 400, Message : "User already exists."});
                }else{
                    this.DB.Models.Users.Insert({Username : Body.Username, Password : Body.Password}).then(() => {
                        res.send({Query : "OK"});
                    });
                }
            });
        });

        this.App.post("/api/login", (req, res) => {
            let Body = req.body;
            if(Body.Username == null || Body.Password == null){
                res.send({Error : 400, Message : "Missing fields."});
                return;
            }
            this.DB.Models.Users.Select({Username : Body.Username}).then((data) => {
                console.log(data);
                if(data == null){
                    res.send({Error : 400, Message : "Wrong information."});
                }else{
                    if(data.Password != Body.Password){
                        res.send({Error : 400, Message : "Wrong information."});
                    }else{
                        let key = this.SM.SetSession(data.ID);
                        res.send({Query : "OK", Key : key, Username : data.Username});
                    }
                }
            });
        })

        this.App.post("/api/check", (req, res) => {
            let Body = req.body;
            console.log(Body);
            if(Body.Key == null){
                res.send({Error : 400, Message : "Missing fields."});
                return;
            }
            let ID = this.SM.GetSession(Body.Key);
            if(ID == null){
                res.send({Error : 400, Message : "Wrong information."});
            }else{
                this.DB.Models.Users.Select({ID : ID}).then((data) => {
                    if(data == null){
                        res.send({Error : 400, Message : "Wrong information."});
                    }else{
                        res.send({Query : "OK"});
                    }
                })
            }
        });

    }

    Listen(){
        this.App.listen({ port : 80 }, () => {
            this.App.log.info(`server listening on ${this.App.server.address().port}`);
        });
    }

}