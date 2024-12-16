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

  // 방송 시작 시간부터 현재까지의 시간 계산
  const calculateBroadcastDuration = (startTime) => {
    if (!startTime) return "시간 정보 없음";

    const start = new Date(startTime);
    const now = new Date();
    const diff = now - start; // 밀리초 단위

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
            {/* 채널 썸네일이 있는 경우에만 표시 */}
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
              <li>😀 긍정 반응: {stats.positiveReactions || "80%"}</li>
              <li>⌛ 방송 진행 시간: {broadcastDuration}</li>
            </ul>
          </div>
        )}
      </div>
    </Link>
  );
};

// 개별 구독 컴포넌트트
const LiveBroadcastCard = ({ data }) => {
  const handleViewStatistics = async () => {
    const youtubeApiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${data.channelId}&eventType=live&type=video&key=${youtubeApiKey}`
      );

      if (response.data.items && response.data.items.length > 0) {
        const video = response.data.items[0]; // 첫 번째 방송 데이터
        const videoId = video.id.videoId;
        const currentDate = new Date().toLocaleDateString("en-CA"); // 현재 날짜 (YYYY-MM-DD)
        window.location.href = `/analytics/${currentDate}/${videoId}`; // 방송 페이지로 이동
      } else {
        alert("현재 이 채널에서 진행 중인 방송이 없습니다.");
      }
    } catch (error) {
      console.error("YouTube API 요청 실패:", error);
      alert("방송 데이터를 가져오는 중 문제가 발생했습니다.");
    }
  };

  // 채널 통계 보기 함수
  const handleChannelAnalytics = () => {
    window.location.href = `/channel/${data.channelId}`;
    console.log(`${data.channelId}`);

  };
  //구독자수변환함수
  const formatSubscriberCount = (count) => {
    if (count >= 10000) {
      return `${(count / 10000).toFixed(2).replace(/\.?0+$/, "")}만명`; // 만 단위
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(2).replace(/\.?0+$/, "")}천명`; // 천 단위
    }
    return `${count}명`; // 1000명 미만 그대로 출력
  };
  return (
    <div className="live-broadcast-card subscribe-card">
      <div className="subscribe-card-header">
        <img
          className="subscribe-card-thumbnail"
          src={data.channelThumbnailUrl}
          alt={`${data.channelTitle} 프로필`}
        />
        <div className="subscribe-card-info">
          <h3 className="subscribe-card-title">
            {data.channelTitle} <span className="verified-badge">✔</span>
          </h3>
          <p className="subscribe-card-subscriber">
            구독자 {formatSubscriberCount(data.channelSubscriberCount)}
          </p>
        </div>
      </div>
      <p className="subscribe-card-description">{data.channelDescription}</p>
      <div className="subscribe-card-buttons">
        <button className="subscribe-card-button" onClick={handleViewStatistics}>
          방송 통계 보기
        </button>
        <button className="subscribe-card-button"onClick={handleChannelAnalytics}>채널 통계 보기</button>
      </div>
    </div>
  );
};

//구독 추가하는 버튼있는카드드
const SubscribeChannelCard = ({ onAddChannel }) => {
  return (
    <div
      className="live-broadcast-card subscribe-channel-card"
      onClick={onAddChannel}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          textAlign: "center",
          color: "#9a9a9a",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <PlusCircle size={48} color="#ffffff" />
        <span style={{ fontSize: "14px" }}>채널 추가하기</span>
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
  const [channelData, setChannelData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userId = sessionStorage.getItem("userId");
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_POD_URL}/api/redis/get/hash/sub/channelId?userId=${userId}`
        );
        const rawData = await response.json();
  
        // JSON 파싱 및 유효한 데이터 필터링
        const parsedData = rawData
          .map((item) => {
            try {
              return JSON.parse(item); // JSON 문자열을 객체로 파싱
            } catch (e) {
              console.error("JSON 파싱 에러:", e);
              return null; // 파싱 실패 시 null 반환
            }
          })
          .filter((item) => item && Object.keys(item).length > 0); // 유효한 객체만 필터링
  
        setChannelData(parsedData);
      } catch (error) {
        console.error("Error fetching channel data:", error);
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
          } catch (e) {
            console.error("JSON 파싱 에러:", e);
            return {};
          }
        });

        // video.category가 'n'인 경우 필터링
        const validData = rawData.filter((video) => video.videoId && (video.category !== 'n'));

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

    fetchData();
    fetchBroadcastData();
  }, []);

  const toggleSubscriptionModal = () => {
    setShowSubscriptionModal(!showSubscriptionModal);
  };

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
      {/* 구독 채널 섹션 */}
      <div className="live-broadcast-category-section">
        <h2 className="live-broadcast-category-title">내 구독 목록</h2>
        <div className="live-broadcast-list-container">
          <button
            className="scroll-button left"
            onClick={() => scroll("내 구독 목록", "left")}
          >
            ◀
          </button>
          <div className="live-broadcast-list" ref={(el) => (scrollRefs.current["내 구독 목록"] = el)}>

          {channelData.map((data, index) => (
              <LiveBroadcastCard key={index} data={data} />
            ))}

            
          <SubscribeChannelCard onAddChannel={toggleSubscriptionModal} />
          </div>
          <button
            className="scroll-button right"
            onClick={() => scroll("내 구독 목록", "right")}
          >
            ▶
          </button>
        </div>
      </div>

      {/* 기존 카테고리별 방송 목록 */}
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
            <button
              className="scroll-button right"
              onClick={() => scroll(category, "right")}
            >
              ▶
            </button>
          </div>
        </div>
      ))}

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <Subscription
          show={showSubscriptionModal}
          onHide={toggleSubscriptionModal}
        />
      )}
    </div>
  );
};

export default LiveBroadcastPage;