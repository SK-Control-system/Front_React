import React from "react";
import "./ChatBox.css";

const ChatBox = () => {
  const chatData = [
    { id: 1, user: "레이첼", time: "오후 1:27", sentiment: "매우 부정", message: "아 스브링이 진짜 짜증나네" },
    { id: 2, user: "조재근", time: "오후 1:28", sentiment: "부정", message: "다들 뭐야 이게..." },
    // 더미 데이터 추가 가능
  ];

  return (
    <div className="chat-box">
      <h2 className="chat-header">Real-time Live Chat</h2>
      <div className="chat-messages">
        {chatData.map((chat) => (
          <div key={chat.id} className={`chat-message ${chat.sentiment}`}>
            <strong>{chat.user}</strong> <span>{chat.time}</span>
            <p>{chat.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatBox;
