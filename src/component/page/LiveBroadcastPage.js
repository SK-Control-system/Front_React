import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LiveBroadcastPage.css";
import { Link } from "react-router-dom";

// BroadcastCard 컴포넌트
const BroadcastCard = ({
  videoTitle,
  channelTitle,
  concurrentViewers,
  category,
  videoThumbnailUrl,
  channelThumbnailUrl,
  actualStartTime,
  stats,
  videoId,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link to={`/channel/${videoId}`} className="live-broadcast-card-link">
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

// LiveBroadcastPage 컴포넌트
const LiveBroadcastPage = () => {
  const [groupedData, setGroupedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBroadcastData = async () => {
      try {
        const response = axios.get("/api/redis/get/hash/videoId")
        .then(response => console.log(response.data))
        .catch(error => console.error(error));
      

        const rawData = response.data; // Axios 응답 데이터
        const parsedData = Object.values(rawData).map((item) => JSON.parse(item));

        // 데이터를 카테고리별로 그룹화
        const grouped = parsedData.reduce((acc, video) => {
          const category = video.category || "기타";
          if (!acc[category]) acc[category] = [];
          acc[category].push(video);
          return acc;
        }, {});

        setGroupedData(grouped);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBroadcastData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="live-broadcast-page">
      {Object.keys(groupedData).map((category, index) => (
        <div key={index} className="live-broadcast-category-section">
          <h2 className="live-broadcast-category-title">{category}</h2>
          <div className="live-broadcast-list">
            {groupedData[category].map((broadcast, idx) => (
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
                stats={{
                  likes: broadcast.likeCount,
                  comments: 450, // 임시 데이터
                  positiveReactions: "80%", // 임시 데이터
                  averageViewTime: "15분", // 임시 데이터
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LiveBroadcastPage;
