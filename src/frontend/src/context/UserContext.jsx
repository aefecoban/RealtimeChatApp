import { useState } from "react";
import { createContext } from "react";

export const UserContext = createContext();

export default function UserProvider({children}){

    let [userInfo, setUserInfo] = useState({
        Key : null,
        Username : null,
    });

    return <UserContext.Provider 
        value={{
            value : userInfo,
            setter : setUserInfo
        }}
    >
        {children}
    </UserContext.Provider>
}