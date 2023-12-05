const ws = require("./communication");
const s = require("./server");
const d = require("./database");
const sm = require("./Session");

async function Main(){
    const SessionManager = new sm();

    const Database = new d();
    await Database.Boot();

    const Server = new s(Database, SessionManager);
    const WebCommunication = new ws(Database, SessionManager);

    Server.Start();
    WebCommunication.Start();
}

Main();