import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./LiveBroadcastPage.css";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import Subscription from "../ShareComponent/Subscription";

const BroadcastCard = ({
  videoTitle,
  channelTitle,
  concurrentViewers,
  category,
  videoThumbnailUrl,
  channelThumbnailUrl,
  actualStartTime,
  stats = {}, // 기본값 설정
  videoId,
  currentDate,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const calculateBroadcastDuration = (startTime) => {
    if (!startTime) return "시간 정보 없음";

    const start = new Date(startTime);
    const now = new Date();
    const diff = now - start;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}시간 ${minutes}분 ${seconds}초`;
  };

  const broadcastDuration = calculateBroadcastDuration(actualStartTime);

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
            {channelThumbnailUrl && (
              <img
                className="live-broadcast-channel-profile"
                src={channelThumbnailUrl || "https://via.placeholder.com/120"}
                alt={`${channelTitle} profile`}
              />
            )}
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
              <li>⌛ 방송 진행 시간: {broadcastDuration}</li>
            </ul>
          </div>
        )}
      </div>
    </Link>
  );
};

const SubscribeChannelCard = ({ channelData }) => {
  const { channelTitle, channelThumbnailUrl, channelSubscriberCount, channelDescription } = channelData;

  return (
    <div className="live-broadcast-card subscribe-card">
      
      <div className="subscribe-card-header">
        <img
          className="subscribe-card-thumbnail"
          src={channelThumbnailUrl || "https://via.placeholder.com/120"}
          alt={`${channelTitle} 프로필`}
        />
        <div className="subscribe-card-info">
          <h3 className="subscribe-card-title">
            {channelTitle} <span className="verified-badge">✔</span>
          </h3>
          <p className="subscribe-card-subscriber">구독자 {channelSubscriberCount || 0}명</p>
        </div>
      </div>
      <p className="subscribe-card-description">{channelDescription || "채널 설명이 없습니다."}</p>
      <div className="subscribe-card-buttons">
        <button className="subscribe-card-button">방송 통계 보기</button>
        <button className="subscribe-card-button">채널 통계 보기</button>
      </div>
    </div>
  );
};

const LiveBroadcastPage = () => {
  const [groupedData, setGroupedData] = useState({});
  const [subscribedChannels, setSubscribedChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const scrollRefs = useRef({});

  useEffect(() => {
    const fetchSubscribedChannels = async () => {
      const userId = sessionStorage.getItem("userId");
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_POD_URL}/api/redis/get/hash/sub/channelId?userId=${userId}`
        );
        const parsedChannels = response.data
          .map((item) => {
            try {
              return JSON.parse(item);
            } catch {
              return null;
            }
          })
          .filter((channel) => channel && channel.channelId);
        setSubscribedChannels(parsedChannels);
      } catch (err) {
        console.error("구독 채널 데이터 불러오기 실패:", err);
      }
    };

    const fetchBroadcastData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_POD_URL}/api/redis/get/hash/videoId`
        );
        if (!response.data) throw new Error("API에서 데이터를 받지 못했습니다.");

        const rawData = Object.values(response.data).map((item) => {
          try {
            return JSON.parse(item);
          } catch {
            return {};
          }
        });

        const validData = rawData.filter((video) => video.videoId && video.category !== "n");
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

    fetchSubscribedChannels();
    fetchBroadcastData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="live-broadcast-page">
      <div className="live-broadcast-category-section">
        <h2 className="live-broadcast-category-title">내 구독 목록</h2>
        <div className="live-broadcast-list-container">
          <div className="live-broadcast-list">
            {subscribedChannels.map((channel, idx) => (
              <SubscribeChannelCard key={idx} channelData={channel} />
            ))}
          </div>
        </div>
      </div>

      {Object.keys(groupedData).map((category, index) => (
        <div key={index} className="live-broadcast-category-section">
          <h2 className="live-broadcast-category-title">{category}</h2>
          <div className="live-broadcast-list-container">
            <div className="live-broadcast-list" ref={(el) => (scrollRefs.current[category] = el)}>
              {groupedData[category].map((broadcast, idx) => {
                const currentDate = broadcast.videoAPIReceivedTime
                  ? broadcast.videoAPIReceivedTime.split(" ")[0]
                  : "unknown";

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
                    currentDate={currentDate}
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
          </div>
        </div>
      ))}
    </div>
  );
};

export default LiveBroadcastPage;
