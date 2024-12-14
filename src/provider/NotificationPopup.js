import React from "react";
import { useWebSocket } from "./websocketContext";

const NotificationPopup = () => {
  const { notification, handleNotification } = useWebSocket();

  if (!notification) return null;

  const { channelTitle, videoTitle } = notification;

  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px", background: "white", padding: "10px", border: "1px solid black" }}>
      <p>
        <strong>{channelTitle}</strong> 채널에서 라이브 방송(<strong>{videoTitle}</strong>)을 시작했습니다. 개별 관제 화면으로 이동할까요?
      </p>
      <button onClick={() => handleNotification("yes")}>예</button>
      <button onClick={() => handleNotification("no")}>아니오</button>
    </div>
  );
};

export default NotificationPopup;