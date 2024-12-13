import { createContext, useContext, useEffect, useState } from "react"

const UserContext = createContext(null);

export const UserProvider = ({children}) =>{
    const [userId, setUserId] = useState(null);
    const [userChannelId, setUserChannelId] = useState(null);
    const [token, setToken] = useState(null);
    const [userName, setUserName] = useState(null); // Google 사용자 이름 상태 추가

    useEffect(() => {
        const storedUserId = sessionStorage.getItem("userId");
        const storedUserChannelId = sessionStorage.getItem("userChannelId");
        const storedToken = sessionStorage.getItem("token");
        const storedUserName = sessionStorage.getItem("userName");
        if (storedUserName) {
            setUserName(storedUserName);
        }
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
        <UserContext.Provider value={{userId, setUserId, userChannelId, setUserChannelId, token, setToken, userName, setUserName}}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () =>{
    return useContext(UserContext);
}