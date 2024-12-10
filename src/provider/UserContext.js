import { createContext, useContext, useEffect, useState } from "react"

const UserContext = createContext(null);

export const UserProvider = ({children}) =>{
    const [userId, setUserId] = useState(null);
    const [userChannelId, setUserChannelId] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedUserId = sessionStorage.getItem("userId");
        const storedUserChannelId = sessionStorage.getItem("userChannelId");
        const storedToken = sessionStorage.getItem("token");

        if(storedUserId) {
            setUserId(storedUserId);
        }
        
        if(storedUserChannelId) {
            setUserChannelId(storedUserChannelId);
        }
        
        if(storedToken) {
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