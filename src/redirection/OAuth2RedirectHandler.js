import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "../provider/UserContext";

export default function OAuth2RedirectHandler(){
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { setUserId, setUserChannelId, setToken } = useUser();
    const id = searchParams.get('userId');
    const channelId = searchParams.get('channelId');
    const token = searchParams.get('accessToken');
    
    console.log("로그인 파라미터 확인:", { id, channelId, token });

    useEffect(() =>{
        console.log("로컬스토리지 설정 시작");
        
        try {
            if(id) {
                localStorage.setItem("userId", id);
                setUserId(id);
                console.log("userId 저장 완료:", id);
            }
            
            if(channelId) {
                localStorage.setItem("userChannelId", channelId);
                setUserChannelId(channelId);
                console.log("channelId 저장 완료:", channelId);
            }
            
            if(token) {
                localStorage.setItem("token", token);
                setToken(token);                
                console.log("token 저장 완료:", token);
            }

            console.log("로컬스토리지 최종 상태:", {
                savedUserId: localStorage.getItem("userId"),
                savedChannelId: localStorage.getItem("userChannelId"),
                savedToken: localStorage.getItem("token")
            });
        } catch (error) {
            console.error("로컬스토리지 저장 중 에러:", error);
        }

        const redirectUrl = sessionStorage.getItem('loginRedirectUrl') || '/';
        console.log("리다이렉트 URL:", redirectUrl);
        sessionStorage.removeItem('loginRedirectUrl');
        navigate(redirectUrl);
    }, [navigate, channelId, id, token, setUserId, setUserChannelId, setToken]);
}