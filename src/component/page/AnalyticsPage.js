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

      // 데이터 구조 변환: 기존 데이터에 items 배열이 있는지 확인하고 sentiment를 최상위로 이동
      const transformedData = parsedData.map((chat) => {
        if (chat.items && chat.items[0] && chat.items[0].sentiment) {
          return {
            ...chat,
            sentiment: chat.items[0].sentiment,
          };
        }
        return chat;
      });

      setChatData(transformedData);
      setTotalChatCount(transformedData.length);

      // emotionData 초기 설정: chatTime을 기준으로 감정 데이터 설정
      const initialEmotionData = transformedData.map((chat) => {
        const sentiment = chat.sentiment || { label: "중립", confidence: 0, scores: { positive: 0, negative: 0, neutral: 1 } };
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

      // 변환된 데이터를 다시 로컬 스토리지에 저장
      localStorage.setItem(`chatData_${videoId}`, JSON.stringify(transformedData));
    } else {
      // videoId에 해당하는 데이터가 없으면 초기화
      setChatData([]);
      setTotalChatCount(0);
      setEmotionData([]);
    }

    // SSE 연결 시작
    eventSourceRef.current = new EventSource(`${process.env.REACT_APP_CHATTING_URL}/stream?videoId=${videoId}`);

    eventSourceRef.current.onmessage = (event) => {
      try {
        const newChat = JSON.parse(event.data);
        console.log(newChat);

        // sentiment가 없으면 기본값 설정
        const validatedChat = {
          ...newChat,
          sentiment: newChat.sentiment || { label: "중립", confidence: 0, scores: { positive: 0, negative: 0, neutral: 1 } },
        };

        setChatData((prevChats) => {
          const updatedChats = [...prevChats, validatedChat];
          // 로컬 스토리지 업데이트
          localStorage.setItem(`chatData_${videoId}`, JSON.stringify(updatedChats));
          return updatedChats;
        });

        // 채팅 총 갯수 업데이트
        setTotalChatCount((prevCount) => prevCount + 1);

        // 긍부정 데이터 업데이트: chatTime을 사용하여 x축 설정
        const { sentiment, chatTime } = validatedChat;
        setEmotionData((prevData) => {
          const newEmotion = {
            time: chatTime,
            veryPositive: sentiment.label === "매우 긍정" ? 1 : 0,
            positive: sentiment.label === "긍정" ? 1 : 0,
            neutral: sentiment.label === "중립" ? 1 : 0,
            negative: sentiment.label === "부정" ? 1 : 0,
            veryNegative: sentiment.label === "매우 부정" ? 1 : 0,
          };
          const updatedData = [...prevData, newEmotion];
          return updatedData;
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
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
};

export default AnalyticsPage;
