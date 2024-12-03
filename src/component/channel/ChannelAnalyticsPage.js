import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ChannelAnalyticsPage.css";

const ChannelAnalyticsPage = () => {
  const { videoId } = useParams(); // URL에서 videoId를 가져옴
  const [currentChannelData, setCurrentChannelData] = useState(null);
  const [activeTab, setActiveTab] = useState("개요");

  // 기존 데이터 유지
  const viewerHistory = [
    { time: "2024-11-01", viewers: 10 },
    { time: "2024-11-02", viewers: 50 },
    { time: "2024-11-03", viewers: 200 },
    { time: "2024-11-04", viewers: 400 },
    { time: "2024-11-05", viewers: 300 },
  ];

  const videos = [
    {
      thumbnail: "https://via.placeholder.com/120x67",
      title: "세상의 중심에서 겨울을 외치는 녀석들",
      date: "2024.11.28",
      likes: 5,
      comments: 0,
    },
    {
      thumbnail: "https://via.placeholder.com/120x67",
      title: "24년 서울 찾는 인과응보",
      date: "2024.11.27",
      likes: 3,
      comments: 0,
    },
    {
      thumbnail: "https://via.placeholder.com/120x67",
      title: "출근시간에 몰래 게임하기",
      date: "2024.11.22",
      likes: 2,
      comments: 0,
    },
    {
      thumbnail: "https://via.placeholder.com/120x67",
      title: "AWS 비용 폭탄 확인하기",
      date: "2024.10.30",
      likes: 1,
      comments: 2,
    },
  ];

  // LiveBroadcastPage에서 전달된 rawData
  const rawData = [
    "{\"videoId\":\"8dYNg7bmS5c\",\"videoData\":{\"channelAPIReceivedTime\":\"2024-11-26 14:16:00\",\"actualStartTime\":\"2024-04-12T10:23:19Z\",\"categoryAPIReceivedTime\":\"2024-11-26 14:15:57\",\"channelSubscriberCount\":\"1830000\",\"channelPublishedAt\":\"2020-05-08T01:06:09.310775Z\",\"videoId\":\"8dYNg7bmS5c\",\"videoTitle\":\"계절의 시작과 끝에 듣는 노래 l 비긴어게인\",\"concurrentViewers\":\"887\",\"channelThumbnailUrl\":\"https://yt3.ggpht.com/sample-8dYNg7bmS5c.jpg\",\"videoAPIReceivedTime\":\"2024-11-26 14:17:44\",\"channelDescription\":\"Sample description for Beginagain 비긴어게인\",\"videoThumbnailUrl\":\"https://i.ytimg.com/vi/8dYNg7bmS5c/hqdefault_live.jpg\",\"channelViewCount\":\"1173570495\",\"ikeCount\":\"397\",\"actualEndTime\":null,\"viewCount\":\"1807571\",\"category\":\"music\",\"channelId\":\"UC8dYNg7bmS5c\",\"channelTitle\":\"Beginagain 비긴어게인\"}}",
    "{\"videoId\":\"4yTnlpI0ZQw\",\"videoData\":{\"channelAPIReceivedTime\":\"2024-11-26 14:16:00\",\"actualStartTime\":\"2024-11-01T12:00:00Z\",\"categoryAPIReceivedTime\":\"2024-11-26 14:15:57\",\"channelSubscriberCount\":\"1830000\",\"channelPublishedAt\":\"2020-05-08T01:06:09.310775Z\",\"videoId\":\"4yTnlpI0ZQw\",\"videoTitle\":\"프로 게이머와 함께하는 생방송!\",\"concurrentViewers\":\"13007\",\"channelThumbnailUrl\":\"https://yt3.ggpht.com/sample-4yTnlpI0ZQw.jpg\",\"videoAPIReceivedTime\":\"2024-11-26 14:17:44\",\"channelDescription\":\"Sample description for GamingPro\",\"videoThumbnailUrl\":\"https://i.ytimg.com/vi/4yTnlpI0ZQw/hqdefault_live.jpg\",\"channelViewCount\":\"1173570495\",\"ikeCount\":\"120097\",\"actualEndTime\":null,\"viewCount\":\"1807571\",\"category\":\"gaming\",\"channelId\":\"UC4yTnlpI0ZQw\",\"channelTitle\":\"GamingPro\"}}",
    "{\"videoId\":\"3kLMnNpXY9z\",\"videoData\":{\"channelAPIReceivedTime\":\"2024-11-26 14:16:00\",\"actualStartTime\":\"2024-08-15T14:30:00Z\",\"categoryAPIReceivedTime\":\"2024-11-26 14:15:57\",\"channelSubscriberCount\":\"1830000\",\"channelPublishedAt\":\"2020-05-08T01:06:09.310775Z\",\"videoId\":\"3kLMnNpXY9z\",\"videoTitle\":\"전 세계의 새로운 과학 뉴스 탐구\",\"concurrentViewers\":\"6887\",\"channelThumbnailUrl\":\"https://yt3.ggpht.com/sample-3kLMnNpXY9z.jpg\",\"videoAPIReceivedTime\":\"2024-11-26 14:17:44\",\"channelDescription\":\"Sample description for ScienceDaily\",\"videoThumbnailUrl\":\"https://i.ytimg.com/vi/3kLMnNpXY9z/hqdefault_live.jpg\",\"channelViewCount\":\"1173570495\",\"ikeCount\":\"63217\",\"actualEndTime\":null,\"viewCount\":\"1807571\",\"category\":\"education\",\"channelId\":\"UC3kLMnNpXY9z\",\"channelTitle\":\"ScienceDaily\"}}",
  ];

  useEffect(() => {
    const parsedData = rawData.map((item) => JSON.parse(item).videoData);
    const channelData = parsedData.find((data) => data.videoId === videoId);
    setCurrentChannelData(channelData);
  }, [videoId]);

  if (!currentChannelData) {
    return <p>Loading...</p>;
  }

  // 방송 시간 계산
  const calculateWatchTime = (startTime) => {
    const start = new Date(startTime);
    const now = new Date();
    return Math.floor((now - start) / (1000 * 60 * 60)); // 시간 단위로 변환
  };

  return (
    <div className="channel-analytics-page">
      <div className="main-chancontent">
        <h1 className="page-title">채널 분석</h1>
        <nav className="tab2s">
          <button
            className={`tab2 ${activeTab === "개요" ? "active" : ""}`}
            onClick={() => setActiveTab("개요")}
          >
            개요
          </button>
          <button
            className={`tab2 ${activeTab === "콘텐츠" ? "active" : ""}`}
            onClick={() => setActiveTab("콘텐츠")}
          >
            콘텐츠
          </button>
        </nav>

        {/* 개요 탭 */}
        {activeTab === "개요" && (
          <>
            <section className="summary">
              <h2>지난 28일 동안 채널의 조회수가 {currentChannelData.channelViewCount}회입니다</h2>
              <div className="summary-stats">
                <div className="stat-box">
                  <p className="stat-label">조회수</p>
                  <p className="stat-value">
                    {currentChannelData.channelViewCount}{" "}
                    <span className="stat-change up">▲ 20%</span>
                  </p>
                  <p className="stat-desc">지난 28일보다 20% 증가</p>
                </div>
                <div className="stat-box">
                  <p className="stat-label">방송 시간 (단위: 시간)</p>
                  <p className="stat-value">
                    {calculateWatchTime(currentChannelData.actualStartTime)}{" "}
                    <span className="stat-change down">▼ 10%</span>
                  </p>
                  <p className="stat-desc">지난 28일보다 10% 감소</p>
                </div>
                <div className="stat-box">
                  <p className="stat-label">구독자</p>
                  <p className="stat-value">
                    {currentChannelData.channelSubscriberCount}{" "}
                    <span className="stat-change down">▼ 5%</span>
                  </p>
                  <p className="stat-desc">지난 28일보다 5% 감소</p>
                </div>
              </div>
            </section>
            <section className="viewer-graph">
              <h2>조회수 추이</h2>
              <div className="graph">
                <svg viewBox="0 0 500 200" className="line-chart">
                  <polyline
                    fill="none"
                    stroke="#03a9f4"
                    strokeWidth="2"
                    points={viewerHistory
                      .map((data, index) => `${index * 60},${200 - data.viewers / 5}`)
                      .join(" ")}
                  />
                </svg>
              </div>
              <p className="graph-desc">지난 28일 동안의 라이브 방송 조회수 데이터</p>
            </section>
          </>
        )}

        {/* 콘텐츠 탭 */}
        {activeTab === "콘텐츠" && (
          <section className="channel-content-page">
            <h1 className="content-title">채널 콘텐츠</h1>
            <div className="video-list">
              {videos.map((video, index) => (
                <div key={index} className="video-item">
                  <img src={video.thumbnail} alt={video.title} className="video-thumbnail" />
                  <div className="video-info">
                    <h3 className="video-title">{video.title}</h3>
                    <p className="video-date">{video.date}</p>
                    <div className="video-stats">
                      <span>좋아요: {video.likes}</span>
                      <span>댓글: {video.comments}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ChannelAnalyticsPage;
