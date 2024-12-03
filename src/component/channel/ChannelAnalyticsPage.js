import React, { useState } from "react";
import "./ChannelAnalyticsPage.css";

const ChannelAnalyticsPage = () => {
  const [activeTab, setActiveTab] = useState("개요");

  const stats = {
    views: 976,
    viewChange: 55,
    watchTime: 11.1,
    watchChange: 56,
    subscribers: 2,
    subChange: 94,
  };

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
          <button
            className={`tab2 ${activeTab === "시청자층" ? "active" : ""}`}
            onClick={() => setActiveTab("시청자층")}
          >
            시청자층
          </button>
          <button
            className={`tab2 ${activeTab === "아이디어" ? "active" : ""}`}
            onClick={() => setActiveTab("아이디어")}
          >
            아이디어
          </button>
        </nav>

        {/* 개요 탭 */}
        {activeTab === "개요" && (
          <>
            <section className="summary">
              <h2>지난 28일 동안 채널의 조회수가 {stats.views}회입니다</h2>
              <div className="summary-stats">
                <div className="stat-box">
                  <p className="stat-label">조회수</p>
                  <p className="stat-value">
                    {stats.views}{" "}
                    <span className="stat-change up">▲ {stats.viewChange}%</span>
                  </p>
                  <p className="stat-desc">지난 28일보다 {stats.viewChange}% 많음</p>
                </div>
                <div className="stat-box">
                  <p className="stat-label">방송 시간 (단위: 시간)</p>
                  <p className="stat-value">
                    {stats.watchTime}{" "}
                    <span className="stat-change down">▼ {stats.watchChange}%</span>
                  </p>
                  <p className="stat-desc">지난 28일보다 {stats.watchChange}% 적음</p>
                </div>
                <div className="stat-box">
                  <p className="stat-label">구독자</p>
                  <p className="stat-value">
                    {stats.subscribers}{" "}
                    <span className="stat-change down">▼ {stats.subChange}</span>
                  </p>
                  <p className="stat-desc">지난 28일보다 {stats.subChange}% 적음</p>
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
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="video-thumbnail"
                  />
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
