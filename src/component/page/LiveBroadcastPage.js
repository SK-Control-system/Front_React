import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./LiveBroadcastPage.css";
import { Link } from "react-router-dom";

const BroadcastCard = ({ videoTitle, channelTitle, concurrentViewers, category, videoThumbnailUrl, channelThumbnailUrl, actualStartTime, stats, videoId, currentDate }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link to={`/analytics/${currentDate}/${videoId}`} className="live-broadcast-card-link">
      <div
        className="live-broadcast-card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="live-broadcast-card-media"
          style={{ backgroundImage: `url(${videoThumbnailUrl})` }}
        ></div>
        <div className="live-broadcast-card-info">
          <div className="live-broadcast-card-name">
            <div className="live-broadcast-channel-group">
              <div className="live-broadcast-youtube-logo">
                <div className="youtube-red-background">
                  <div className="youtube-white-play"></div>
                </div>
              </div>
              <span className="live-broadcast-channel-name">{channelTitle}</span>
            </div>
            <span className="live-broadcast-category">{category}</span>
          </div>
          <div className="live-broadcast-card-content">
            <img
              className="live-broadcast-channel-profile"
              src={channelThumbnailUrl || "https://via.placeholder.com/120"}
              alt={`${channelTitle} profile`}
            />
            <span className="live-broadcast-card-title">{videoTitle}</span>
          </div>
          <div className="live-broadcast-card-footer">
            <span className="live-broadcast-view-count">
              🔴{concurrentViewers || 0} 명 시청중
            </span>
            <span className="live-broadcast-start-time">{actualStartTime || "시간 정보 없음"}</span>
          </div>
        </div>
        {isHovered && (
          <div className="broadcast-stats-overlay text-stats-overlay">
            <h4 className="text-stats-title">실시간 방송 통계</h4>
            <ul className="text-stats-list">
              <li>❤️ 좋아요: {stats.likes || 0}개</li>
              <li>💬 댓글: {stats.comments || 0}개</li>
              <li>😀 긍정 반응: {stats.positiveReactions || "80%"}</li>
              <li>⌛ 방송 진행 시간: {stats.averageViewTime || "15분"}</li>
            </ul>
          </div>
        )}
      </div>
    </Link>
  );
};

const LiveBroadcastPage = () => {
  const [groupedData, setGroupedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollRefs = useRef({});

  useEffect(() => {
    const fetchBroadcastData = async () => {
      try {
        const response = await axios.get("/api/redis/get/hash/videoId");
        if (!response.data) throw new Error("API에서 데이터를 받지 못했습니다.");

        const rawData = Object.values(response.data).map((item) => {
          try {
            return JSON.parse(item);
          } catch (e) {
            console.error("JSON 파싱 에러:", e);
            return {};
          }
        });

        const validData = rawData.filter((video) => video.videoId);
        const grouped = validData.reduce((acc, video) => {
          const category = video.category || "기타";
          if (!acc[category]) acc[category] = [];
          acc[category].push(video);
          return acc;
        }, {});

        setGroupedData(grouped);
        setLoading(false);
      } catch (err) {
        console.error("데이터 가져오기 실패:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBroadcastData();
  }, []);

  const scroll = (category, direction) => {
    const scrollElement = scrollRefs.current[category];
    if (scrollElement) {
      const scrollAmount = direction === "left" ? -600 : 600;
      scrollElement.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="live-broadcast-page">
      {Object.keys(groupedData).map((category, index) => (
        <div key={index} className="live-broadcast-category-section">
          <h2 className="live-broadcast-category-title">{category}</h2>
          <div className="live-broadcast-list-container">
            <button
              className="scroll-button left"
              onClick={() => scroll(category, "left")}
            >
              ◀
            </button>
            <div
              className="live-broadcast-list"
              ref={(el) => (scrollRefs.current[category] = el)}
            >
              {groupedData[category].map((broadcast, idx) => {
                const currentDate = broadcast.videoAPIReceivedTime
                ? broadcast.videoAPIReceivedTime.split(" ")[0]
                : "unknown";  //날짜만추출
              
                return (
                  <BroadcastCard
                    key={idx}
                    videoId={broadcast.videoId}
                    videoTitle={broadcast.videoTitle}
                    channelTitle={broadcast.channelTitle}
                    concurrentViewers={broadcast.concurrentViewers}
                    category={broadcast.category}
                    videoThumbnailUrl={broadcast.videoThumbnailUrl}
                    channelThumbnailUrl={broadcast.channelThumbnailUrl}
                    actualStartTime={broadcast.actualStartTime}
                    currentDate={currentDate} // 날짜 전달
                    stats={{
                      likes: broadcast.likeCount,
                      comments: 450,
                      positiveReactions: "80%",
                      averageViewTime: "15분",
                    }}
                  />
                );
              })}
            </div>
            <button
              className="scroll-button right"
              onClick={() => scroll(category, "right")}
            >
              ▶
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LiveBroadcastPage;
