// src/components/AnalyticsPage.js
import React, { useEffect, useState } from "react";
import Tabs from "../analytics/Tabs";
import EmotionTrendChart from "../analytics/EmotionTrendChart";
import ChatBox from "../analytics/ChatBox";
import { useParams } from "react-router-dom";
import useSSE from "../../hook/UseSSE";

const AnalyticsPage = () => {
  const [emotionData, setEmotionData] = useState([]);
  const [chatData, setChatData] = useState([]);
  const [filteredChatData, setFilteredChatData] = useState([]);
  const [totalChatCount, setTotalChatCount] = useState(0); // 채팅 총 갯수
  const [activeTab, setActiveTab] = useState("viewerReaction");
  const [searchQuery, setSearchQuery] = useState("");
  const { currentDate, videoId } = useParams();

  useEffect(() => {
    console.log("Video ID:", videoId);

    // 로컬 스토리지 초기화: 현재 videoId와 다른 데이터 삭제
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("chatData_") && key !== `chatData_${videoId}`) {
        localStorage.removeItem(key);
      }
    });

    // 로컬 스토리지에서 데이터 불러오기
    const storedChatData = localStorage.getItem(`chatData_${videoId}`);
    if (storedChatData) {
      let parsedData = JSON.parse(storedChatData);

      setChatData(parsedData);
      setTotalChatCount(parsedData.length);

      // emotionData 초기 설정: chatTime을 기준으로 감정 데이터 설정
      const initialEmotionData = parsedData.map((chat) => {
        const sentiment =
          chat.sentiment || {
            label: "중립",
            confidence: 0,
            scores: { positive: 0, negative: 0, neutral: 1 },
          };
        return {
          time: chat.chatTime,
          veryPositive: sentiment.label === "매우 긍정" ? 1 : 0,
          positive: sentiment.label === "긍정" ? 1 : 0,
          neutral: sentiment.label === "중립" ? 1 : 0,
          negative: sentiment.label === "부정" ? 1 : 0,
          veryNegative: sentiment.label === "매우 부정" ? 1 : 0,
        };
      });

      setEmotionData(initialEmotionData);
    } else {
      // videoId에 해당하는 데이터가 없으면 초기화
      setChatData([]);
      setTotalChatCount(0);
      setEmotionData([]);
    }
  }, [videoId]);

  // SSE 메시지 핸들러 - 초기 데이터 처리
  const handleInitialData = (bulkChats) => {
    // 중복 방지를 위해 기존 chatData에 없는 채팅만 추가
    const newChats = bulkChats.filter(
      (chat) =>
        !chatData.some(
          (existingChat) =>
            existingChat.chatTime === chat.chatTime &&
            existingChat.message === chat.message
        )
    );

    if (newChats.length > 0) {
      setChatData((prevChats) => {
        const updatedChats = [...prevChats, ...newChats];
        localStorage.setItem(`chatData_${videoId}`, JSON.stringify(updatedChats));
        return updatedChats;
      });

      setTotalChatCount((prevCount) => prevCount + newChats.length);

      // emotionData 업데이트
      const newEmotion = newChats.map((chat) => {
        const sentiment =
          chat.sentiment || {
            label: "중립",
            confidence: 0,
            scores: { positive: 0, negative: 0, neutral: 1 },
          };
        return {
          time: chat.chatTime,
          veryPositive: sentiment.label === "매우 긍정" ? 1 : 0,
          positive: sentiment.label === "긍정" ? 1 : 0,
          neutral: sentiment.label === "중립" ? 1 : 0,
          negative: sentiment.label === "부정" ? 1 : 0,
          veryNegative: sentiment.label === "매우 부정" ? 1 : 0,
        };
      });

      setEmotionData((prevData) => [...prevData, ...newEmotion]);
    }
  };

  // SSE 메시지 핸들러 - 실시간 메시지 처리
  const handleMessage = (newChat) => {
    // 중복 방지를 위해 기존에 동일한 채팅이 있는지 확인
    const isDuplicate = chatData.some(
      (chat) =>
        chat.chatTime === newChat.chatTime && chat.message === newChat.message
    );

    if (!isDuplicate) {
      const validatedChat = {
        ...newChat,
        sentiment:
          newChat.sentiment || {
            label: "중립",
            confidence: 0,
            scores: { positive: 0, negative: 0, neutral: 1 },
          },
      };

      setChatData((prevChats) => {
        const updatedChats = [...prevChats, validatedChat];
        localStorage.setItem(`chatData_${videoId}`, JSON.stringify(updatedChats));
        return updatedChats;
      });

      setTotalChatCount((prevCount) => prevCount + 1);

      // emotionData 업데이트
      const { sentiment, chatTime } = validatedChat;
      const newEmotion = {
        time: chatTime,
        veryPositive: sentiment.label === "매우 긍정" ? 1 : 0,
        positive: sentiment.label === "긍정" ? 1 : 0,
        neutral: sentiment.label === "중립" ? 1 : 0,
        negative: sentiment.label === "부정" ? 1 : 0,
        veryNegative: sentiment.label === "매우 부정" ? 1 : 0,
      };

      setEmotionData((prevData) => [...prevData, newEmotion]);
    }
  };

  // SSE 오류 핸들러
  const handleError = (error) => {
    console.error("최종 SSE 연결 오류:", error);
    // 추가적인 오류 처리 로직 (예: 사용자 알림)
  };

  // Custom Hook 사용 - 초기 데이터와 실시간 메시지 처리
  useSSE(
    `${process.env.REACT_APP_CHATTING_URL}/stream?videoId=${videoId}`,
    handleInitialData, // 초기 데이터 핸들러
    handleMessage, // 실시간 메시지 핸들러
    handleError
  );

  useEffect(() => {
    // 검색 필터링
    if (searchQuery.trim() === "") {
      setFilteredChatData(chatData);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredChatData(
        chatData.filter((chat) =>
          chat.message.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, chatData]);

  return (
    <div className="analytics-container">
      <div className="좌측">
        <div className="chatsearch">
          <input
            type="text"
            placeholder="채팅 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="chat-search"
          />
          <p>총 채팅 수: {totalChatCount}</p> {/* 총 갯수 표시 */}
        </div>

        <ChatBox chatData={filteredChatData} />
      </div>
      <div className="우측">
        <EmotionTrendChart data={emotionData} />
        <Tabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentDate={currentDate}
          videoId={videoId}
        />
      </div>
    </div>
  );
};

export default AnalyticsPage;
