import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BroadcastRanking.css";
import { useNavigate } from "react-router-dom"; // useNavigate 훅 추가

const fallbackData = [
  "{}",
  "{\"channelPublishedAt\":\"'n'\",\"videoId\":\"pEi2lBrLt3g\",\"actualStartTime\":\"2024-12-05 04:08:30\",\"channelThumbnailUrl\":\"'n'\",\"viewCount\":\"327025\",\"channelDescription\":\"'n'\",\"likeCount\":\"10869\",\"videoTitle\":\"‘재형이의 썸씽\",\"channelAPIReceivedTime\":\"'n'\",\"categoryAPIReceivedTime\":\"2024-12-06 15:35:47\",\"category\":\"game\",\"channelSubscriberCount\":\"'n'\",\"channelId\":\"UCF5Wkdo3inmxP-Y59wXDsFw\",\"videoAPIReceivedTime\":\"2024-12-06 15:36:50\",\"videoThumbnailUrl\":\"https://i.ytimg.com/vi/YPTxG3t53FU/hqdefault_live.jpg\",\"concurrentViewers\":\"6937\",\"channelTitle\":\"재형이당\",\"actualEndTime\":\"'n'\",\"channelViewCount\":\"'n'\"}",
  // ... (나머지 fallbackData)
];

const ITEMS_PER_PAGE = 10;

function BroadcastRanking() {
  const [rankings, setRankings] = useState([]);
  const [filteredRankings, setFilteredRankings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // useNavigate 훅 사용

  const [searchTerm, setSearchTerm] = useState("");

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
        setFilteredRankings(sortedRankings);
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
        setFilteredRankings(fallbackRankings);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  useEffect(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    const filtered = rankings.filter((rank) =>
      rank.title.toLowerCase().includes(lowercasedTerm) ||
      rank.name.toLowerCase().includes(lowercasedTerm) ||
      rank.category.toLowerCase().includes(lowercasedTerm)
    );
    setFilteredRankings(filtered);
    setCurrentPage(1); 
  }, [searchTerm, rankings]);

  const totalPages = Math.ceil(filteredRankings.length / ITEMS_PER_PAGE);
  const paginatedRankings = filteredRankings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <div className="broadcast-ranking loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="broadcast-ranking error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="broadcast-ranking">
      <div className="ranking-header">
        <h2>방송 랭킹</h2>
        <div className="ranking-controls">
          <input
            type="text"
            className="search-input"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
          {paginatedRankings.length > 0 ? (
            paginatedRankings.map((rank, index) => (
              <tr
                key={index}
                className="ranking-row"
                onClick={() => navigate(`/analytics/${rank.currentDate}/${rank.videoId}`)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    navigate(`/analytics/${rank.currentDate}/${rank.videoId}`);
                  }
                }}
              >
                <td className="rank-column">#{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
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
                <td>{rank.title}</td>
                <td>{rank.viewers.toLocaleString()}명</td>
                <td>
                  {rank.category !== 'n' && (
                    <span className="category-badge" data-tooltip={rank.category}>
                      {rank.category}
                    </span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-results">
                검색 결과가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`page-button ${page === currentPage ? "active" : ""}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default BroadcastRanking;