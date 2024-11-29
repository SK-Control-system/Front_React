import React from "react";
import "./ChatBox.css";

const ChatBox = () => {
  const chatData = [
    {
      id: 1,
      user: "레이첼",
      time: "오후 1:27",
      sentiment: "매우 부정",
      message: "아 스브링이 진짜 짜증나네",
      profilePic: "https://yt3.ggpht.com/ytc/AIdro_kFqbmXOoxJIaLVQYrJMB8gR8_LTF7Wm1lDpZbCmqhJh3U=s88-c-k-c0x00ffffff-no-rj",
    },
    {
      id: 2,
      user: "조재근",
      time: "오후 1:28",
      sentiment: "부정",
      message: "다들 뭐야 이게...",
      profilePic: "https://yt3.ggpht.com/ezG7fZAoI4puqxZvEHRY0Xfwl6CcR3bWRadwh-lg_-JSuBw9aK6hpJuR5wIlu1WHhsvseAWzfyA=s88-c-k-c0x00ffffff-no-rj",
    },
    // 더미 데이터 추가 가능
  ];

  const sentimentColors = {
    "매우 긍정": "#4caf50",
    "긍정": "#8bc34a",
    "중립": "#ffc107",
    "부정": "#ff9800",
    "매우 부정": "#f44336",
  };

  return (
    <div className="chat-box">
      <h2 className="chat-header">Real-time Live Chat</h2>
      <div className="chat-messages">
        {chatData.map((chat) => (
          <div
            key={chat.id}
            className="chat-message"
            style={{ borderLeft: `5px solid ${sentimentColors[chat.sentiment]}` }}
          >
            <img
              src={chat.profilePic}
              alt={`${chat.user} profile`}
              className="chat-profile-pic"
            />
            <div className="chat-content">
              <div className="chat-info">
                <strong className="chat-user">{chat.user}
                  <span className="chat-time">{chat.time}</span>
                </strong>
              </div>
              <p className="chat-text">{chat.message}</p>
            </div>
            <span
              className="chat-sentiment"
              style={{ backgroundColor: sentimentColors[chat.sentiment] }}
            >
              {chat.sentiment}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatBox;
