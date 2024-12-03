import React, { useEffect, useRef, useState } from "react";
import Tabs from "../analytics/Tabs";
import EmotionTrendChart from "../analytics/EmotionTrendChart";
import ChatBox from "../analytics/ChatBox";

const AnalyticsPage = () => {
  const [emotionData, setEmotionData] = useState([]);
  const [chatData, setChatData] = useState([]);
  const [filteredChatData, setFilteredChatData] = useState([]);
  const [totalChatCount, setTotalChatCount] = useState(0); // 채팅 총 갯수
  const [activeTab, setActiveTab] = useState("viewerReaction");
  const [searchQuery, setSearchQuery] = useState("");
  const eventSourceRef = useRef(null);
  const videoId = "_L_kjyJkgwk";
  // const { videoId } = useParams();

  useEffect(() => {
    // 로컬 스토리지 초기화
    Object.keys(localStorage).forEach((key) => {
      // 현재 videoId와 다른 데이터 삭제
      if (key.startsWith("chatData_") && key !== `chatData_${videoId}`) {
        localStorage.removeItem(key);
      }
    });

    // 로컬 스토리지에서 데이터 불러오기
    const storedChatData = localStorage.getItem(`chatData_${videoId}`);
    if (storedChatData) {
      const parsedData = JSON.parse(storedChatData); // JSON 파싱
      setChatData(parsedData);
      setTotalChatCount(parsedData.length); // 배열의 길이를 가져옴
    } else {
      // videoId에 해당하는 데이터가 없으면 초기화
      setChatData([]);
      setTotalChatCount(0);
    }

    // SSE 연결 시작
    eventSourceRef.current = new EventSource(`${process.env.REACT_APP_CHATTING_URL}/stream?videoId=${videoId}`);

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
          const time = new Date().toLocaleTimeString();

          // 새로운 감정 데이터를 기반으로 업데이트
          const newEmotion = {
            time,
            veryPositive: sentiment.label === "매우 긍정" ? 1 : 0,
            positive: sentiment.label === "긍정" ? 1 : 0,
            neutral: sentiment.label === "중립" ? 1 : 0,
            negative: sentiment.label === "부정" ? 1 : 0,
            veryNegative: sentiment.label === "매우 부정" ? 1 : 0,
          };

          // 최신 10개 데이터 유지
          const updatedData = [...prevData, newEmotion];
          return updatedData; // return updatedData.length > 10 ? updatedData.slice(-10) : updatedData;
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
