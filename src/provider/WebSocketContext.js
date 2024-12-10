import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./UserContext";

// WebSocket Context 생성
const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const { userId } = useUser();

  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState(null); // 백엔드에서 온 메시지 저장

  useEffect(() => {
    if (!userId) {
      console.error("userId 없음");
      return;
    }

    // WebSocket 연결
    const ws = new WebSocket(
      `ws://${process.env.REACT_APP_WEBSOCKET_URL}/ws/notifications?userId=${userId}`
    );

    ws.onopen = () => console.log("WebSocket connected");
    
    // 에러 핸들러 추가
    ws.onerror = (error) => {
      console.error("WebSocket 연결 에러:", error);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Message from server:", data);

        if (data.type === "alert") {
          setMessage(data.message);
        }
      } catch (error) {
        console.error("WebSocket 메시지 처리 중 에러:", error);
      }
    };

    ws.onclose = (event) => {
      if (event.wasClean) {
        console.log(`WebSocket 연결 정상 종료 (코드: ${event.code}, 사유: ${event.reason})`);
      } else {
        console.error("WebSocket 연결이 비정상적으로 종료됨");
      }
    };

    setSocket(ws);

    // 컴포넌트 언마운트 시 WebSocket 닫기
    return () => {
      ws.close();
    };
  }, [userId]);

  return (
    <WebSocketContext.Provider value={{ socket, message, setMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// WebSocket Context 사용을 위한 Custom Hook
export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
