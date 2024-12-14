import React, { useState } from "react";
import AnalyticsPage from "../page/AnalyticsPage";
import "./Kjh.css"; // 스타일 적용

const KjhChannelPage = () => {
  const [selectedVideoId, setSelectedVideoId] = useState(""); // 비디오 아이디 상태
  const [showAnalytics, setShowAnalytics] = useState(false); // AnalyticsPage 표시 여부

  // 비디오 ID 선택 핸들러
  const handleVideoSelect = (e) => {
    setSelectedVideoId(e.target.value);
    setShowAnalytics(true); // 비디오 선택 시 AnalyticsPage 보여주기
  };

  return (
    <div className="kjh-channel-container">
      {/* 비디오 선택 드롭다운 */}
      <div className="video-select-container">
        <h2>비디오 아이디 선택</h2>
        <select value={selectedVideoId} onChange={handleVideoSelect}>
          <option value="" disabled>
            비디오를 선택하세요
          </option>
          <option value="chatLive1210">chatLive1210</option>
          <option value="chatLive1212">chatLive1212</option>
          <option value="chatLive1214">chatLive1214</option>
        </select>
      </div>

      {/* AnalyticsPage 컴포넌트 */}
      {showAnalytics && selectedVideoId && (
        <AnalyticsPage currentDate={new Date().toISOString().split("T")[0]} videoId={selectedVideoId} />
      )}
    </div>
  );
};

export default KjhChannelPage;
