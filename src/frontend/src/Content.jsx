import { useContext } from "react";
import { useState } from "react"
import useWebSocket from 'react-use-websocket';
import { UserContext } from "./context/UserContext";
import { useRef } from "react";
import { useEffect } from "react";

export default function Content(){

    let UContext = useContext(UserContext);
    let [text, setText] = useState("");
    let messagesEndRef = useRef(null);
    let [messages, setMessages] = useState([]);

    function ScrollToLastMessage(){
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    useEffect(() => {
        ScrollToLastMessage();
    }, [messages]);

    const { sendMessage, lastMessage, readyState } = useWebSocket("ws://localhost:8080", {
        onOpen : () => {
            console.log("Connection Start.");
        },
        onMessage : (message) => {
            let data = JSON.parse(message.data ?? "{}");
            if(data.Message != null){
                if(Array.isArray(data.Message)){
                    setMessages(data.Message);
                }else{
                    let buff = Array.from(messages);
                    buff.push(data);
                    setMessages(buff);
                }
            }
        }
    })

    function Send(){
        let val = {
            Key : UContext.value.Key,
            Message : text
        };
        sendMessage(JSON.stringify(val));
        setText("");
    }

    return <div className="Content">
        <div className="Box">

            <div className="Messages">
                {
                    (Array.isArray(messages) ? messages : []).map((message, index) => {
                        return <div className={message.Author == UContext.value.Username ? "Message Self" : "Message Other"} key={index}>
                            <div className="Author">{message.Author}</div>
                            <div className="Text">{message.Message}</div>
                        </div>
                    })
                }
                <div ref={messagesEndRef} />
            </div>

            <div className="Inputs">
                <div className="Text">
                    <textarea placeholder="Text" value={text} onChange={(e) => setText(e.target.value)}></textarea>
                </div>
                <div className="Send">
                    <button onClick={(e) => {
                        e.preventDefault();
                        Send();
                    }}>Send</button>
                </div>
            </div>

        </div>
    </div>
}