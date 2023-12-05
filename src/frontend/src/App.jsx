import { useContext } from "react";
import Content from "./Content";
import Header from "./Header";
import { UserContext } from "./context/UserContext";
import { useState } from "react";
import urls from "./urls";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from "react";
import { Helmet } from "react-helmet";

export default function App() {

    let UContext = useContext(UserContext);
    let [logedCheck, setLogedCheck] = useState(false);

    useEffect(() => {
        if(window.localStorage != null){
            try{
                let vals = window.localStorage.getItem("key");
                if(vals != null){
                    vals = JSON.parse(vals);
                    let buff = {
                        Key : vals.Key,
                        Username : vals.Username
                    }

                    if(buff.Key != null){
                        fetch(urls.check, {
                            method : "POST",
                            headers : {
                                "Content-Type" : "application/json"
                            },
                            body : JSON.stringify({
                                Key : buff.Key
                            })
                        }).then((v) => v.json()).then((v) => {
                            if(v.Error != null){
                                toast.error(v.Message);
                                UContext.setter({ Key : null, Username : null });
                            }else{
                                toast.success("Giriş başarılı");
                                UContext.setter(buff);
                            }
                        })
                    }
                }
            }catch(error){
                UContext.setter({ Key : null, Username : null });
            }
        }

    }, []);


    return <>
        {
            (!logedCheck && UContext?.value?.Key == null) ?
            <Guest />
            :
            <Home />
        }
    </>

}

function Guest() {

    let [sTab, sSTab] = useState(0);

    return <div className="Guest">
        <Helmet>
            <title>Guest</title>
        </Helmet>
        <div className="TabArea">
            <div className="tabs">
                <div className={sTab == 0 ? "tab active" : "tab"} onClick={() => sSTab(0)}>Giriş</div>
                <div className={sTab == 1 ? "tab active" : "tab"} onClick={() => sSTab(1)}>Kayıt</div>
            </div>
            <div className="panel">
                {
                    sTab == 0 ?
                    <Login />
                    :
                    <Register />
                }
            </div>
        </div>
    </div>
}

function Login(){
    let UContext = useContext(UserContext);
    let [name, setName] = useState("");
    let [password, setPassword] = useState("");

    return <>
        <h3>Giriş</h3>
        <div className="FormElement">
            <label>Kullanıcı Adı</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="FormElement">
            <label>Şifre</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="FormElement">
            <button onClick={(e) => {
                e.preventDefault();
                fetch(urls.login, {
                    method : "POST",
                    headers : {
                        "Content-Type" : "application/json"
                    },
                    body : JSON.stringify({
                        Username : name,
                        Password : password
                    })
                }).then((v) => v.json()).then((v) => {
                    if(v.Key != null){
                        UContext.setter({
                            Key : v.Key,
                            Username : v.Username
                        });
                        if(window.localStorage != null)
                            window.localStorage.setItem("key", JSON.stringify({
                                Key : v.Key,
                                Username : v.Username
                            }));
                    }else{
                        toast.error(v?.Message ?? "Wrong username or password");
                    }
                }).catch((e) => {
                    toast.error("Connection error");
                })
            }}>Giriş Yap</button>
        </div>
    </>
}

function Register(){
    let [name, setName] = useState("");
    let [password, setPassword] = useState("");

    return <>
        <h3>Kayıt</h3>
        <div className="FormElement">
            <label>Kullanıcı Adı</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="FormElement">
            <label>Şifre</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="FormElement">
        <button onClick={(e) => {
                e.preventDefault();
                fetch(urls.register, {
                    method : "POST",
                    headers : {
                        "Content-Type" : "application/json"
                    },
                    body : JSON.stringify({
                        Username : name,
                        Password : password
                    })
                }).then((v) => v.json()).then((v) => {
                    if(v.Query != null){
                        toast.success("Register success.");
                    }else{
                        toast.error(v?.Message ?? "User already exists.")
                    }
                }).catch((e) => {
                    toast.error("Connection error");
                })
            }}>Kayıt Ol</button>
        </div>
    </>
}

function Home(){
    return <div id="App">
        <Helmet>
            <title>Home</title>
        </Helmet>
        <Header />
        <Content />
    </div>
}