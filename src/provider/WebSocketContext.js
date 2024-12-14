import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { useUser } from "./UserContext";
import { XMLParser } from "fast-xml-parser"; // XML 파싱을 위한 라이브러리

// WebSocket Context 생성
const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const { userId } = useUser();

  const socketRef = useRef(null); // socket을 useRef로 관리
  const [message, setMessage] = useState(null); // 백엔드에서 온 메시지 저장
  const [retryCount, setRetryCount] = useState(0); // 재연결 시도 횟수
  const [notification, setNotification] = useState(null); // 알림 데이터 저장
  const processedVideoIds = useRef(new Set()); // 이미 처리한 videoId 저장

  useEffect(() => {
    if (!userId) {
      console.error("userId 없음");
      return;
    }

    const connectWebSocket = () => {
      const ws = new WebSocket(`wss://${process.env.REACT_APP_WEBSOCKET_URL}/ws/notifications?userId=${userId}`);

      ws.onopen = () => {
        console.log("WebSocket connected");
        setRetryCount(0);
      };

      ws.onerror = (error) => {
        console.error("WebSocket 연결 에러:", error);
      };

      const parser = new XMLParser({ ignoreAttributes: false });

      ws.onmessage = (event) => {
        try {
          const xmlData = event.data;
          const jsonData = parser.parse(xmlData);

          console.log("Message from server (parsed):", jsonData);

          const entry = jsonData.feed && jsonData.feed.entry;
          if (entry) {
            const channelTitle = entry?.author?.name;
            const videoTitle = entry?.title;
            const videoId = entry["yt:videoId"];

            // 중복된 videoId인지 확인
            if (!processedVideoIds.current.has(videoId)) {
              // 새 videoId인 경우 처리
              processedVideoIds.current.add(videoId);
              setNotification({
                channelTitle,
                videoTitle,
                videoId,
              });
            } else {
              console.log(`중복된 videoId(${videoId}) 무시`);
            }
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
          const retryInterval = Math.min(1000 * 2 ** retryCount, 35000);
          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
          }, retryInterval);
        }
      };

      socketRef.current = ws; // useRef를 통해 ws 인스턴스 보관
    };

    connectWebSocket();

    return () => {
      // 언마운트 시 socketRef.current가 있으면 닫는다.
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [userId, retryCount]); // socket 미포함

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
    <WebSocketContext.Provider value={{ socket: socketRef.current, message, setMessage, notification, handleNotification }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// WebSocket Context 사용을 위한 Custom Hook
export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
