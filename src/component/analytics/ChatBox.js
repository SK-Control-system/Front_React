import React from "react";
import "./ChatBox.css";

const ChatBox = ({ chatData }) => {

  const sentimentColors = {
    "매우 긍정": "#4caf50",
    "긍정": "#8bc34a",
    "중립": "#ffc107",
    "부정": "#ff9800",
    "매우 부정": "#f44336",
  };

  return (
    <div className="chat-box">
      <h2 className="chat-header">실시간 채팅창</h2>
      <div className="chat-messages">
        {chatData.map((chat) => (
          <div
            key={`${chat.items[0].chatterChannelId}_${chat.items[0].chatTime}_${Math.random()}`}
            className="chat-message"
            style={{ borderLeft: `5px solid ${sentimentColors[chat.items[0].sentiment.label]}` }}
          >
            <img
              src={chat.items[0].chatterImageUrl}
              alt={`${chat.items[0].chatterName} profile`}
              className="chat-profile-pic"
            />
            <div className="chat-content">
              <div className="chat-info">
                <strong className="chat-user">{chat.items[0].chatterName}
                  <span className="chat-time">{chat.items[0].chatTime}</span>
                </strong>
              </div>
              <p className="chat-text">{chat.items[0].message}</p>
            </div>
            <span
              className="chat-sentiment"
              style={{ backgroundColor: sentimentColors[chat.items[0].sentiment.label] }}
            >
              {chat.items[0].sentiment.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatBox;
