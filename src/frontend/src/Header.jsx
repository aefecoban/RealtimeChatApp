import { useContext } from "react";
import { UserContext } from "./context/UserContext";

export default function Header(){
    let UContext = useContext(UserContext);
    return <header>
        <div className="headerArea"></div>
        <h1>WebSocket Based Communicate</h1>
        <div className="headerArea">
            <button
                onClick={(e) => {
                    e.preventDefault();
                    UContext.setter({ Key : null, Username : null });
                    if(window.localStorage != null)
                        if(window.localStorage.getItem("key") != null)
                            window.localStorage.removeItem("key");
                }}
                style={{
                    backgroundColor : "rgb(251 100 100)"
                }}
            >Çıkış</button>
        </div>
    </header>
}