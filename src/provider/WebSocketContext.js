import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./UserContext";
import { parseStringPromise } from "xml2js"; // XML 파싱을 위한 라이브러리

// WebSocket Context 생성
const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const { userId } = useUser();

  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState(null); // 백엔드에서 온 메시지 저장
  const [retryCount, setRetryCount] = useState(0); // 재연결 시도 횟수
  const [notification, setNotification] = useState(null); // 알림 데이터 저장

  useEffect(() => {
    if (!userId) {
      console.error("userId 없음");
      return;
    }

    // WebSocket 연결
    const connectWebSocket = () => {
      const ws = new WebSocket(
        `wss://${process.env.REACT_APP_WEBSOCKET_URL}/ws/notifications?userId=${userId}`
      );

      ws.onopen = () => {
        console.log("WebSocket connected");
        setRetryCount(0); // 연결 성공 시 재시도 횟수 초기화
      };

      // 에러 핸들러 추가
      ws.onerror = (error) => {
        console.error("WebSocket 연결 에러:", error);
      };

      ws.onmessage = async (event) => {
        try {
          const xmlData = event.data;
          const jsonData = await parseStringPromise(xmlData, { explicitArray: false });

          console.log("Message from server (parsed):", jsonData);

          // XML 데이터에서 필요한 정보 추출
          const entry = jsonData.feed.entry;
          if (entry) {
            const channelTitle = entry.author.name;
            const videoTitle = entry.title;
            const videoId = entry["yt:videoId"];

            // 알림 데이터 설정
            setNotification({
              channelTitle,
              videoTitle,
              videoId,
            });
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
          // 재연결 시도
          const retryInterval = Math.min(1000 * 2 ** retryCount, 35000); // 재연결 간격 증가 (최대 35초)
          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
            connectWebSocket();
          }, retryInterval);
        }
      };

      setSocket(ws);
    };

    connectWebSocket();

    // 컴포넌트 언마운트 시 WebSocket 닫기
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [userId, retryCount, socket]);

  // 알림 처리 함수
  const handleNotification = async (response) => {
    if (response === "yes" && notification) {
      const currentDate = new Date().toISOString().split("T")[0]; // 오늘 날짜 (YYYY-MM-DD 형식)
      const { videoId } = notification;

      // 페이지 이동
      window.location.href = `/analytics/${currentDate}/${videoId}`;
    }
    setNotification(null); // 알림 초기화
  };

  return (
    <WebSocketContext.Provider value={{ socket, message, setMessage, notification, handleNotification }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// WebSocket Context 사용을 위한 Custom Hook
export const useWebSocket = () => {
  return useContext(WebSocketContext);
};