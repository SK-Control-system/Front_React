import React, { useEffect, useRef } from "react";
import "./ChatBox.css";

const ChatBox = ({ chatData }) => {
  const chatBoxRef = useRef(null); // 채팅창 요소에 접근하기 위한 Ref 생성

  const sentimentColors = {
    "매우 긍정": "#4caf50",
    "긍정": "#8bc34a",
    "중립": "#ffc107",
    "부정": "#ff9800",
    "매우 부정": "#f44336",
  };

  useEffect(() => {
    // 새로운 채팅이 추가될 때마다 스크롤을 최하단으로 이동
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatData]); // chatData가 변경될 때마다 실행

  return (
    <div className="chat-box">
      <h2 className="chat-header">실시간 채팅창</h2>
      <div className="chat-messages" ref={chatBoxRef} style={{ overflowY: "auto", maxHeight: "400px" }}>
        {chatData.map((chat) => (
          <div
            key={`${chat.chatterChannelId}_${chat.chatTime}_${Math.random()}`}
            className="chat-message"
            style={{
              borderLeft: `5px solid ${
                sentimentColors[chat.sentiment.label] || "#000"
              }`,
            }}
          >
            <img
              src={chat.chatterImageUrl}
              alt={`${chat.chatterName} profile`}
              className="chat-profile-pic"
            />
            <div className="chat-content">
              <div className="chat-info">
                <strong className="chat-user">
                  {chat.chatterName}
                  <span className="chat-time">{chat.chatTime}</span>
                </strong>
              </div>
              <p className="chat-text">{chat.message}</p>
            </div>
            <span
              className="chat-sentiment"
              style={{
                backgroundColor:
                  sentimentColors[chat.sentiment.label] || "#000",
              }}
            >
              {chat.sentiment.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatBox;
