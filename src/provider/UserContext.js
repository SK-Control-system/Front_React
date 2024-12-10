import { createContext, useContext, useEffect, useState } from "react"

const UserContext = createContext(null);

export const UserProvider = ({children}) =>{
    const [userId, setUserId] = useState(null);
    const [userChannelId, setUserChannelId] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        const storedUserChannelId = localStorage.getItem("userChannelId");
        const storedToken = localStorage.getItem("token");

        if(storedUserId && storedUserChannelId && storedToken){
            setUserId(storedUserId);
            setUserChannelId(storedUserChannelId);
            setToken(storedToken);
        }
    }, []);

    return(
        <UserContext.Provider value={{userId, setUserId, userChannelId, setUserChannelId, token, setToken}}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () =>{
    return useContext(UserContext);
}