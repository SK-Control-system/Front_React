import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ChannelAnalyticsPage.css";
import dayjs from "dayjs";

const ChannelAnalyticsPage = () => {
  const { videoId } = useParams(); // URL에서 videoId를 가져옴
  const [currentChannelData, setCurrentChannelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        // API 호출
        const response = await axios.get("/api/redis/get/hash/videoId");

        // JSON 파싱 및 유효한 데이터 필터링
        const parsedData = response.data
          .map((item) => {
            try {
              return JSON.parse(item); // JSON 형식 파싱
            } catch (e) {
              return null; // 파싱 실패한 데이터는 null로 처리
            }
          })
          .filter((data) => data && data.videoId); // 유효한 데이터만 필터링

        // videoId에 해당하는 데이터 찾기
        const matchingData = parsedData.find((data) => data.videoId === videoId);

        if (matchingData) {
          setCurrentChannelData(matchingData); // 상태 업데이트
        } else {
          setError("해당 videoId에 대한 데이터를 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("API 호출 오류:", error);
        setError("데이터를 가져오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchChannelData();
  }, [videoId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const parseCustomDate = (dateString) => {
    const parts = dateString.split(" "); // "Mon Dec 02 05:50:40 KST" 분리
    const months = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
    };
    const month = months[parts[1]];
    const day = parseInt(parts[2], 10);
    const [hours, minutes, seconds] = parts[3].split(":").map(Number);
    const year = new Date().getFullYear(); // 연도를 현재 연도로 설정
  
    return new Date(year, month, day, hours, minutes, seconds);
  };
  
  const calculateWatchTime = (startTime) => {
    const start = parseCustomDate(startTime);
    if (isNaN(start)) {
      console.error("유효하지 않은 시작 시간:", startTime);
      return "시간 정보 없음";
    }
  
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

        {activeTab === "개요" && (
          <>
            <section className="summary">
              <h2>지난 28일 동안 채널의 조회수가 {currentChannelData.viewCount}회입니다</h2>
              <div className="summary-stats">
                <div className="stat-box">
                  <p className="stat-label">조회수</p>
                  <p className="stat-value">{currentChannelData.viewCount}</p>
                </div>
                <div className="stat-box">
                  <p className="stat-label">방송 시간 (단위: 시간)</p>
                  <p className="stat-value">
                    {calculateWatchTime(currentChannelData.actualStartTime)}
                  </p>
                </div>
                <div className="stat-box">
                  <p className="stat-label">좋아요 수</p>
                  <p className="stat-value">{currentChannelData.likeCount}</p>
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
