import { createContext, useContext, useEffect, useState } from "react"

const UserContext = createContext(null);

export const UserProvider = ({children}) =>{
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");

        if(storedToken){
            setToken(storedToken);
        }
    }, []);

    return(
        <UserContext.Provider value={{token, setToken}}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () =>{
    return useContext(UserContext);
}