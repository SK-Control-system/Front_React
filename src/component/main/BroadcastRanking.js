import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BroadcastRanking.css";
import { Link } from "react-router-dom"; // React Router의 Link 컴포넌트 추가

const fallbackData = [
  "{}",
  "{\"channelPublishedAt\":\"'n'\",\"videoId\":\"pEi2lBrLt3g\",\"actualStartTime\":\"2024-12-05 04:08:30\",\"channelThumbnailUrl\":\"'n'\",\"viewCount\":\"327025\",\"channelDescription\":\"'n'\",\"likeCount\":\"10869\",\"videoTitle\":\"‘재형이의 썸씽\",\"channelAPIReceivedTime\":\"'n'\",\"categoryAPIReceivedTime\":\"2024-12-06 15:35:47\",\"category\":\"game\",\"channelSubscriberCount\":\"'n'\",\"channelId\":\"UCF5Wkdo3inmxP-Y59wXDsFw\",\"videoAPIReceivedTime\":\"2024-12-06 15:36:50\",\"videoThumbnailUrl\":\"https://i.ytimg.com/vi/YPTxG3t53FU/hqdefault_live.jpg\",\"concurrentViewers\":\"6937\",\"channelTitle\":\"재형이당\",\"actualEndTime\":\"'n'\",\"channelViewCount\":\"'n'\"}",
  "{\"channelPublishedAt\":\"'n'\",\"videoId\":\"pEi2lBrLt3g\",\"actualStartTime\":\"2024-12-05 01:04:30\",\"channelThumbnailUrl\":\"'n'\",\"viewCount\":\"987025\",\"channelDescription\":\"'n'\",\"likeCount\":\"15869\",\"videoTitle\":\"‘비상계엄사태 관련 긴급 현안질의’ 국회 국방위원회 전체회의 - [끝까지LIVE] MBC 중계방송 2024년 12월 05일\",\"channelAPIReceivedTime\":\"'n'\",\"categoryAPIReceivedTime\":\"2024-12-06 15:35:47\",\"category\":\"정치\",\"channelSubscriberCount\":\"'n'\",\"channelId\":\"UCF4Wxdo3inmxP-Y59wXDsFw\",\"videoAPIReceivedTime\":\"2024-12-06 15:36:50\",\"videoThumbnailUrl\":\"https://i.ytimg.com/vi/YPTxG3t53FU/hqdefault_live.jpg\",\"concurrentViewers\":\"36954\",\"channelTitle\":\"MBCNEWS\",\"actualEndTime\":\"'n'\",\"channelViewCount\":\"'n'\"}",
  "{\"channelPublishedAt\":\"'n'\",\"videoId\":\"pEi2lBrLt3g\",\"actualStartTime\":\"2024-12-05 04:08:30\",\"channelThumbnailUrl\":\"'n'\",\"viewCount\":\"327025\",\"channelDescription\":\"'n'\",\"likeCount\":\"12169\",\"videoTitle\":\"째니의 개인방송\",\"channelAPIReceivedTime\":\"'n'\",\"categoryAPIReceivedTime\":\"2024-12-06 15:35:47\",\"category\":\"정치\",\"channelSubscriberCount\":\"'n'\",\"channelId\":\"UCF5Wkdo3inmxP-Y59wXDsFw\",\"videoAPIReceivedTime\":\"2024-12-06 15:36:50\",\"videoThumbnailUrl\":\"https://i.ytimg.com/vi/YPTxG3t53FU/hqdefault_live.jpg\",\"concurrentViewers\":\"2837\",\"channelTitle\":\"째니\",\"actualEndTime\":\"'n'\",\"channelViewCount\":\"'n'\"}",
  "{\"channelPublishedAt\":\"'n'\",\"videoId\":\"pEi2lBrLt3g\",\"actualStartTime\":\"2024-12-05 04:08:30\",\"channelThumbnailUrl\":\"'n'\",\"viewCount\":\"327025\",\"channelDescription\":\"'n'\",\"likeCount\":\"9969\",\"videoTitle\":\"석훈이의일상\",\"channelAPIReceivedTime\":\"'n'\",\"categoryAPIReceivedTime\":\"2024-12-06 15:35:47\",\"category\":\"game\",\"channelSubscriberCount\":\"'n'\",\"channelId\":\"UCF5Wkdo3inmxP-Y59wXDsFw\",\"videoAPIReceivedTime\":\"2024-12-06 15:36:50\",\"videoThumbnailUrl\":\"https://i.ytimg.com/vi/YPTxG3t53FU/hqdefault_live.jpg\",\"concurrentViewers\":\"19937\",\"channelTitle\":\"석훈이당\",\"actualEndTime\":\"'n'\",\"channelViewCount\":\"'n'\"}",
  "{\"channelPublishedAt\":\"'n'\",\"videoId\":\"pEi2lBrLt3g\",\"actualStartTime\":\"2024-12-05 04:08:30\",\"channelThumbnailUrl\":\"'n'\",\"viewCount\":\"327025\",\"channelDescription\":\"'n'\",\"likeCount\":\"9969\",\"videoTitle\":\"롤악귀\",\"channelAPIReceivedTime\":\"'n'\",\"categoryAPIReceivedTime\":\"2024-12-06 15:35:47\",\"category\":\"영화\",\"channelSubscriberCount\":\"'n'\",\"channelId\":\"UCF5Wkdo3inmxP-Y59wXDsFw\",\"videoAPIReceivedTime\":\"2024-12-06 15:36:50\",\"videoThumbnailUrl\":\"https://i.ytimg.com/vi/YPTxG3t53FU/hqdefault_live.jpg\",\"concurrentViewers\":\"23937\",\"channelTitle\":\"욱진이의롤방송\",\"actualEndTime\":\"'n'\",\"channelViewCount\":\"'n'\"}",
  "{}",
  "{}",
  "{}",
  "{}",
];

function BroadcastRanking() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_POD_URL}/api/redis/get/hash/videoId`);
        const rawData = Object.values(response.data).map((item) =>
          JSON.parse(item)
        );

        const sortedRankings = rawData
          .filter((video) => video.concurrentViewers)
          .sort((a, b) => b.concurrentViewers - a.concurrentViewers)
          .map((video) => ({
            name: video.channelTitle,
            title: video.videoTitle,
            viewers: parseInt(video.concurrentViewers || 0, 10),
            category: video.category || "기타",
            profileImage: video.channelThumbnailUrl || "https://via.placeholder.com/88",
            videoId: video.videoId, // videoId 추가
            currentDate: video.videoAPIReceivedTime
              ? video.videoAPIReceivedTime.split(" ")[0] // 날짜 추출
              : "2024-12-12", // 기본값 설정
          }));

        setRankings(sortedRankings);
      } catch (err) {
        console.error("API 요청 실패:", err);
        setError("API 요청 실패");
        // 기본 데이터를 사용
        const rawData = fallbackData.map((item) =>
          item !== "{}" ? JSON.parse(item) : {}
        );

        const fallbackRankings = rawData
          .filter((video) => video.concurrentViewers)
          .sort((a, b) => b.concurrentViewers - a.concurrentViewers)
          .map((video) => ({
            name: video.channelTitle || "Unknown Channel",
            title: video.videoTitle || "Unknown Title",
            viewers: parseInt(video.concurrentViewers || 0, 10),
            category: video.category || "기타",
            profileImage: video.videoThumbnailUrl || "https://via.placeholder.com/88",
            videoId: video.videoId, // videoId 추가
            currentDate: video.videoAPIReceivedTime.split(" ")[0]
          }));

        setRankings(fallbackRankings);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="broadcast-ranking">
      <div className="ranking-header">
        <h2>방송 랭킹</h2>
        <div className="ranking-controls">
          <input
            type="text"
            className="search-input"
            placeholder="Search for anything..."
          />
          <button className="search-button">
            <i className="fas fa-search"></i>
          </button>
          <div className="date-filter">
            <span>10 May - 20 May</span>
            <i className="fas fa-caret-down"></i>
          </div>
        </div>
      </div>
      <table className="ranking-table">
        <thead>
          <tr>
            <th>순위</th>
            <th>이름</th>
            <th>제목</th>
            <th>시청자 수</th>
            <th>분류</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((rank, index) => (
            <tr key={index}>
              <td className="rank-column">#{index + 1}</td>
              <td>
                <div className="profile">
                  <span
                    className="profile-circle"
                    style={{
                      backgroundImage: `url(${rank.profileImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></span>
                  {rank.name}
                </div>
              </td>
              <td>
                <Link to={`/analytics/${rank.currentDate}/${rank.videoId}`}>
                  {rank.title}
                </Link>
              </td>
              <td>{rank.viewers.toLocaleString()}명</td>
              <td>
                <span className="category-badge">{rank.category}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BroadcastRanking;