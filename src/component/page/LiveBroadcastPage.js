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
  // stats,
  stats = {},
  videoId,
  currentDate,
}) => {
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
  const [userId, setUserId] = useState(() => {
    // 세션스토리지에서 userId 가져오기
    return sessionStorage.getItem("userId") || null;
  });
  const [liveVideos, setLiveVideos] = useState([]);
  
  useEffect(() => {
    const fetchSubscribedChannels = async () => {
      console.log(userId);
      try {
        const params = new URLSearchParams({ userId });
        const url = `${process.env.REACT_APP_BACKEND_POD_URL}/api/es/channel-ids?${params.toString()}`;
        const response = await axios.post(url);
        setSubscribedChannels(response.data);
      } catch (err) {
        console.error("구독 채널 데이터 불러오기 실패:", err);
        setError("구독 채널을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    const fetchGetSubChannelId = async () => {
      try {
        const params = new URLSearchParams({ userId });
        const url = `${process.env.REACT_APP_BACKEND_POD_URL}/api/sub/channel/card?${params.toString()}`;
    
        console.log("API 호출 URL:", url); // URL 로그 확인
    
        const response = await axios.post(url);
    
        console.log("서버 응답:", response.data);
    
        const channelIds = response.data;
    
        if (!channelIds || channelIds.length === 0) {
          throw new Error("서버에서 채널 ID를 가져오지 못했습니다.");
        }
    
        setSubscribedChannels(channelIds);
        fetchLiveVideos(channelIds); // 유튜브 API 호출
      } catch (err) {
        console.error("구독 채널 불러오기 실패:", err);
        setError("구독 채널을 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };
    
    

    const fetchLiveVideos = async (channelIds) => {
      try {
        const apiKey = "AIzaSyAk61e0vXHzb_d8kIegfJpsUUY6YXD8oV4";
        const youtubeAPIBase = "https://www.googleapis.com/youtube/v3/search";

        console.log("채널 IDs:", channelIds);

        // 여러 채널의 실시간 데이터를 병렬로 요청
        const requests = channelIds.map((channelId) => {
          const url = `${youtubeAPIBase}?part=snippet&channelId=${channelId}&eventType=live&type=video&key=${apiKey}`;
          return axios.get(url);
        });

        const responses = await Promise.all(requests);
        const videos = responses
          .map((res) => res.data.items)
          .flat(); // 여러 API 응답 결과를 합쳐서 단일 배열로

        setLiveVideos(videos);
        setLoading(false);
      } catch (err) {
        console.error("유튜브 실시간 방송 불러오기 실패:", err);
        setError("실시간 방송을 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
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
    if (userId) {
      fetchSubscribedChannels();
      fetchBroadcastData();
      fetchGetSubChannelId(); // 추가된 함수 호출
    }
  }, [userId]);

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

      <div
        className="live-broadcast-list"
        ref={(el) => (scrollRefs.current["내 구독 목록"] = el)}
      >
        {liveVideos.length > 0 ? (
          liveVideos.map((video, idx) => (
            <BroadcastCard
              key={idx}
              videoId={video.id.videoId}
              videoTitle={video.snippet.title}
              channelTitle={video.snippet.channelTitle}
              videoThumbnailUrl={video.snippet.thumbnails.high.url}
              channelThumbnailUrl={video.snippet.thumbnails.default.url}
              actualStartTime={video.snippet.publishedAt}
              currentDate={video.snippet.publishedAt.split("T")[0]}
              stats={{
                likes: 0, // 좋아요 수는 필요시 다른 API로 가져올 수 있음
                comments: 0,
                positiveReactions: "N/A",
                averageViewTime: "N/A",
              }}
            />
          ))
        ) : (
          <p style={{ color: "#aaa", textAlign: "center" }}>
            실시간 방송 중인 채널이 없습니다.
          </p>
        )}

        {/* 채널 추가하기 버튼 */}
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
                      // likes: broadcast.likeCount,
                      likes: 123,
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
