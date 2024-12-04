import React, { createContext, useContext, useEffect, useState } from "react";

// WebSocket Context 생성
const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ userId, children }) => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState(null); // 백엔드에서 온 메시지 저장

  useEffect(() => {
    if (!userId) {
      console.error("userId가 필요합니다.");
      return;
    }

    // WebSocket 연결
    const ws = new WebSocket(
      `wss://${process.env.REACT_APP_API_POD_URL}/ws/notifications?userId=${userId}`
    );

    ws.onopen = () => console.log("WebSocket connected");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Message from server:", data);

      // 특정 신호 처리
      if (data.type === "alert") {
        setMessage(data.message); // 백엔드에서 온 알림 메시지 저장
      }
    };
    ws.onclose = () => console.log("WebSocket disconnected");
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
