import React from "react";
import { useWebSocket } from "./WebSocketContext";

const NotificationPopup = () => {
  const { notification, handleNotification } = useWebSocket();

  if (!notification) return null;

  const { channelTitle, videoTitle } = notification;

  const containerStyle = {
    position: "fixed",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "white",
    padding: "20px 30px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    zIndex: 9999,
    fontFamily: "sans-serif",
    textAlign: "center",
  };

  const buttonStyle = {
    background: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    padding: "8px 16px",
    margin: "10px 5px 0 5px",
    cursor: "pointer",
  };

  const textStyle = {
    margin: "0 0 10px 0",
    fontSize: "14px",
    lineHeight: "1.5",
  };

  return (
    <div style={containerStyle}>
      <p style={textStyle}>
        <strong>{channelTitle}</strong> 채널에서 라이브 방송(<strong>{videoTitle}</strong>)을 시작했습니다.  
        개별 관제 화면으로 이동할까요?
      </p>
      <div>
        <button style={buttonStyle} onClick={() => handleNotification("yes")}>예</button>
        <button style={buttonStyle} onClick={() => handleNotification("no")}>아니오</button>
      </div>
    </div>
  );
};

export default NotificationPopup;
