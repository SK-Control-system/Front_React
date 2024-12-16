import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ChannelAnalyticsPage.css";
import dayjs from "dayjs";

const ChannelAnalyticsPage = () => {
  const { channelId } = useParams();
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("YYYY-MM"));
  const [monthlyData, setMonthlyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_POD_URL}/api/es/statistics/monthly?index=video_youtube_*&channelId=${channelId}&month=${selectedMonth}`
        );        
        setMonthlyData(response.data);
      } catch (error) {
        console.error("월별 데이터 로드 오류:", error);
        setError("선택한 달의 데이터를 가져오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyData();
  }, [selectedMonth]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="channel-analytics-page">
      <div className="main-chancontent">
        <h1 className="page-title">월별 채널 통계</h1>
        <section className="monthly-stats">
          <label htmlFor="month-select">달 선택:</label>
          <select id="month-select" value={selectedMonth} onChange={handleMonthChange}>
            {Array.from({ length: 12 }, (_, i) => {
              const month = dayjs().month(i).format("YYYY-MM");
              return (
                <option key={month} value={month}>
                  {month}
                </option>
              );
            })}
          </select>

          {monthlyData ? (
            <div className="summary-stats">
              <div className="stat-box">
                <p className="stat-label">평균 조회수</p>
                <p className="stat-value">{monthlyData.averageViewCount}</p>
              </div>
              <div className="stat-box">
                <p className="stat-label">평균 좋아요</p>
                <p className="stat-value">{monthlyData.averageLikeCount}</p>
              </div>
              <div className="stat-box">
                <p className="stat-label">총 방송 횟수</p>
                <p className="stat-value">{monthlyData.totalBroadcasts}</p>
              </div>
              <div className="stat-box">
                <p className="stat-label">비디오 조회수 추이</p>
                <ul>
                  {Object.entries(monthlyData.videoViewTrends).map(([videoId, views], idx) => (
                    <li key={idx}>{videoId}: {views}회</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p>선택한 달의 데이터가 없습니다.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default ChannelAnalyticsPage;
