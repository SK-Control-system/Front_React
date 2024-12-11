// src/hooks/useSSE.js
import { useEffect, useRef } from "react";

const useSSE = (
  url,
  onInitialData, // 초기 데이터 핸들러
  onMessage,     // 실시간 메시지 핸들러
  onError,
  maxReconnectAttempts = 10,
  baseReconnectDelay = 1000
) => {
  const eventSourceRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);

  const initializeSSE = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    eventSourceRef.current = new EventSource(url);

    eventSourceRef.current.onopen = () => {
      console.log("SSE 연결이 열렸습니다.");
      reconnectAttemptsRef.current = 0;
    };

    // 초기 데이터 이벤트 리스너
    eventSourceRef.current.addEventListener("initial", (event) => {
      try {
        const data = JSON.parse(event.data);
        onInitialData(data);
      } catch (error) {
        console.error("초기 데이터 처리 오류:", error);
      }
    });

    // 실시간 메시지 이벤트 리스너
    eventSourceRef.current.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error("실시간 메시지 처리 오류:", error);
      }
    });

    eventSourceRef.current.onerror = (error) => {
      console.error("SSE 연결 오류:", error);
      eventSourceRef.current.close();
      eventSourceRef.current = null;

      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        const delay = Math.min(
          baseReconnectDelay * 2 ** reconnectAttemptsRef.current,
          30000
        ); // 최대 30초
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectAttemptsRef.current += 1;
          console.log(`SSE 재연결 시도 ${reconnectAttemptsRef.current}번째`);
          initializeSSE();
        }, delay);
      } else {
        console.error(
          "SSE 재연결 시도 횟수 초과. 더 이상 재연결을 시도하지 않습니다."
        );
        if (onError) onError(error);
      }
    };
  };

  useEffect(() => {
    initializeSSE();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
};

export default useSSE;
