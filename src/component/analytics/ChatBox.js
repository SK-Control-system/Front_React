import React, { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import "./ChatBox.css";

const ChatBox = ({ chatData }) => {
  const chatBoxRef = useRef(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredChats, setFilteredChats] = useState(chatData);

  const sentimentColors = {
    "매우 긍정": "#4caf50",
    "긍정": "#8bc34a",
    "중립": "#ffc107",
    "부정": "#ff9800",
    "매우 부정": "#f44336",
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatData]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredChats(chatData);
    } else {
      const filtered = chatData.filter((chat) =>
        chat.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredChats(filtered);
    }
  }, [searchQuery, chatData]);

  return (
    <div className="chat-box">
      <div className="chat-header-container">
        <h2 className="chat-header">실시간 채팅창</h2>
        <button
          className="search-toggle-btn"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
        >
          <Search size={20} color="white" />
        </button>
      </div>

      <div className={`search-modal ${isSearchOpen ? 'open' : ''}`}>
        <input
          type="text"
          placeholder="채팅 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <p className="search-results">
          검색결과: {filteredChats.length}개 / 전체: {chatData.length}개
        </p>
      </div>

      <div 
        className="chat-messages" 
        ref={chatBoxRef}
        style={{ overflowY: "auto", maxHeight: "calc(100vh - 20px)"}}
      >
        {filteredChats.map((chat) => (
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
                <strong className="chat-user">{chat.chatterName}</strong>
              </div>
              <p className="chat-text">{chat.message}</p>
            </div>
            <span
              className="chat-sentiment"
              style={{
                backgroundColor: sentimentColors[chat.sentiment.label] || "#000",
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