import React, { useEffect, useRef, useState } from "react";
import Tabs from "../analytics/Tabs";
import EmotionTrendChart from "../analytics/EmotionTrendChart";
import ChatBox from "../analytics/ChatBox";
import { useParams } from "react-router-dom";

const AnalyticsPage = () => {
  const [emotionData, setEmotionData] = useState([]);
  const [chatData, setChatData] = useState([]);
  const [filteredChatData, setFilteredChatData] = useState([]);
  const [totalChatCount, setTotalChatCount] = useState(0); // 채팅 총 갯수
  const [activeTab, setActiveTab] = useState("viewerReaction");
  const [searchQuery, setSearchQuery] = useState("");
  const eventSourceRef = useRef(null);
  const { videoId } = useParams();

  useEffect(() => {
    // 로컬 스토리지에서 데이터 불러오기
    const storedChatData = localStorage.getItem(`chatData_${videoId}`);
    if (storedChatData) {
      const parsedData = JSON.parse(storedChatData); // JSON 파싱
      setChatData(parsedData);
      setTotalChatCount(parsedData.length); // 배열의 길이를 가져옴
    }

    // SSE 연결 시작
    eventSourceRef.current = new EventSource(`${process.env.REACT_APP_CHATTING_URL}/stream?videoId=${videoId}`); // videoId ? videoId : '_L_kjyJkgwk'

    eventSourceRef.current.onmessage = (event) => {
      try {
        const newChat = JSON.parse(event.data);

        setChatData((prevChats) => {
          const updatedChats = [...prevChats, newChat];
          // 로컬 스토리지 업데이트
          localStorage.setItem(`chatData_${videoId}`, JSON.stringify(updatedChats));
          return updatedChats;
        });

        // 채팅 총 갯수 업데이트
        setTotalChatCount((prevCount) => prevCount + 1);

        // 긍부정 데이터 업데이트
        const { sentiment } = newChat.items[0];
        setEmotionData((prevData) => {
          const time = new Date().toLocaleTimeString(); // 현재 시간을 가져옴
          const newEmotion = {
            time,
            ...prevData.reduce((acc, emotion) => {
              acc[emotion.label] = acc[emotion.label] || 0; // 초기값 설정
              if (emotion.label === sentiment.label) {
                acc[emotion.label] += 1; // 같은 감정 카운트 증가
              }
              return acc;
            }, {}),
          };
          return [...prevData.slice(-9), newEmotion]; // 최신 10개 데이터 유지
        });
        
      } catch (error) {
        console.error("SSE 데이터 처리 오류", error);
      }
    };

    eventSourceRef.current.onerror = (error) => {
      console.error("SSE 연결 오류", error);
      eventSourceRef.current.close();
    };

    // 컴포넌트 언마운트 시 SSE 연결 종료
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [videoId]);

  useEffect(() => {
    // 검색 필터링
    if (searchQuery.trim() === "") {
      setFilteredChatData(chatData);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredChatData(
        chatData.filter((chat) =>
          chat.items[0].message.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, chatData]);

  return (
    <div className="analytics-container">
      <div className="좌측">
        <input
          type="text"
          placeholder="채팅 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="chat-search"
        />
        <p>총 채팅 수: {totalChatCount}</p> {/* 총 갯수 표시 */}
        <ChatBox chatData={filteredChatData} />
      </div>
      <div className="우측">
        <EmotionTrendChart data={emotionData} />
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
};

export default AnalyticsPage;
