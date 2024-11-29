import React, { useState, useEffect } from "react";
import "./LiveBroadcastPage.css";

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
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
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
            src={channelThumbnailUrl}
            alt={`${channelTitle} profile`}
          />
          <span className="live-broadcast-card-title">{videoTitle}</span>
        </div>
        <div className="live-broadcast-card-footer">
          <span className="live-broadcast-view-count">{concurrentViewers} 명 시청중</span>
          <span className="live-broadcast-start-time">{actualStartTime} 시작</span>
        </div>
      </div>
      {isHovered && (
        <div className="broadcast-stats-overlay text-stats-overlay">
          <h4 className="text-stats-title">실시간 방송 통계</h4>
          <ul className="text-stats-list">
            <li>❤️ 좋아요: {stats.likes}개</li>
            <li>💬 댓글: {stats.comments}개</li>
            <li>😀 긍정 반응: {stats.positiveReactions}</li>
            <li>⌛ 방송 진행 시간: {stats.averageViewTime}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

// LiveBroadcastPage 컴포넌트
const LiveBroadcastPage = () => {
  const rawData = [
    // 주어진 JSON 데이터 (문자열 형태)
    "{\"videoId\":\"8dYNg7bmS5c\",\"videoData\":{\"channelAPIReceivedTime\":\"2024-11-26 14:16:00\",\"actualStartTime\":\"2024-04-12T10:23:19Z\",\"categoryAPIReceivedTime\":\"2024-11-26 14:15:57\",\"channelSubscriberCount\":\"1830000\",\"channelPublishedAt\":\"2020-05-08T01:06:09.310775Z\",\"videoId\":\"8dYNg7bmS5c\",\"videoTitle\":\"계절의 시작과 끝에 듣는 노래 l 비긴어게인\",\"concurrentViewers\":\"887\",\"channelThumbnailUrl\":\"https://yt3.ggpht.com/sample-8dYNg7bmS5c.jpg\",\"videoAPIReceivedTime\":\"2024-11-26 14:17:44\",\"channelDescription\":\"Sample description for Beginagain 비긴어게인\",\"videoThumbnailUrl\":\"https://i.ytimg.com/vi/8dYNg7bmS5c/hqdefault_live.jpg\",\"channelViewCount\":\"1173570495\",\"ikeCount\":\"10097\",\"actualEndTime\":null,\"viewCount\":\"1807571\",\"category\":\"music\",\"channelId\":\"UC8dYNg7bmS5c\",\"channelTitle\":\"Beginagain 비긴어게인\"}}",
    "{\"videoId\":\"4yTnlpI0ZQw\",\"videoData\":{\"channelAPIReceivedTime\":\"2024-11-26 14:16:00\",\"actualStartTime\":\"2024-11-01T12:00:00Z\",\"categoryAPIReceivedTime\":\"2024-11-26 14:15:57\",\"channelSubscriberCount\":\"1830000\",\"channelPublishedAt\":\"2020-05-08T01:06:09.310775Z\",\"videoId\":\"4yTnlpI0ZQw\",\"videoTitle\":\"프로 게이머와 함께하는 생방송!\",\"concurrentViewers\":\"887\",\"channelThumbnailUrl\":\"https://yt3.ggpht.com/sample-4yTnlpI0ZQw.jpg\",\"videoAPIReceivedTime\":\"2024-11-26 14:17:44\",\"channelDescription\":\"Sample description for GamingPro\",\"videoThumbnailUrl\":\"https://i.ytimg.com/vi/4yTnlpI0ZQw/hqdefault_live.jpg\",\"channelViewCount\":\"1173570495\",\"ikeCount\":\"10097\",\"actualEndTime\":null,\"viewCount\":\"1807571\",\"category\":\"gaming\",\"channelId\":\"UC4yTnlpI0ZQw\",\"channelTitle\":\"GamingPro\"}}",
    "{\"videoId\":\"3kLMnNpXY9z\",\"videoData\":{\"channelAPIReceivedTime\":\"2024-11-26 14:16:00\",\"actualStartTime\":\"2024-08-15T14:30:00Z\",\"categoryAPIReceivedTime\":\"2024-11-26 14:15:57\",\"channelSubscriberCount\":\"1830000\",\"channelPublishedAt\":\"2020-05-08T01:06:09.310775Z\",\"videoId\":\"3kLMnNpXY9z\",\"videoTitle\":\"전 세계의 새로운 과학 뉴스 탐구\",\"concurrentViewers\":\"887\",\"channelThumbnailUrl\":\"https://yt3.ggpht.com/sample-3kLMnNpXY9z.jpg\",\"videoAPIReceivedTime\":\"2024-11-26 14:17:44\",\"channelDescription\":\"Sample description for ScienceDaily\",\"videoThumbnailUrl\":\"https://i.ytimg.com/vi/3kLMnNpXY9z/hqdefault_live.jpg\",\"channelViewCount\":\"1173570495\",\"ikeCount\":\"10097\",\"actualEndTime\":null,\"viewCount\":\"1807571\",\"category\":\"education\",\"channelId\":\"UC3kLMnNpXY9z\",\"channelTitle\":\"ScienceDaily\"}}",
  ];

  // JSON 문자열을 객체로 변환
  const parsedData = rawData.map((item) => JSON.parse(item).videoData);

  // 카테고리별로 그룹화
  const groupedData = parsedData.reduce((acc, video) => {
    if (!acc[video.category]) acc[video.category] = [];
    acc[video.category].push(video);
    return acc;
  }, {});

  return (
    <div className="live-broadcast-page">
      {Object.keys(groupedData).map((category, index) => (
        <div key={index} className="live-broadcast-category-section">
          <h2 className="live-broadcast-category-title">{category}</h2>
          <div className="live-broadcast-list">
            {groupedData[category].map((broadcast, idx) => (
              <BroadcastCard
                key={idx}
                videoTitle={broadcast.videoTitle}
                channelTitle={broadcast.channelTitle}
                concurrentViewers={broadcast.concurrentViewers}
                category={broadcast.category}
                videoThumbnailUrl={broadcast.videoThumbnailUrl}
                channelThumbnailUrl={broadcast.channelThumbnailUrl}
                actualStartTime={new Date(broadcast.actualStartTime).toLocaleString()}
                stats={{
                  likes: broadcast.ikeCount || 0,
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
