import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewerCategoryStats.css";

// 미리 정의된 색상 팔레트
const predefinedColors = [
  "#5c5ce0",
  "#43ff8c",
  "#ff7f50",
  "#1e90ff",
  "#ff69b4",
  "#ffa500",
  "#00ced1",
  "#dda0dd",
];

const fallbackData = [
  // ... (기존 fallbackData)
];

function ViewerCategoryStats() {
  const [categories, setCategories] = useState([]);
  const [totalViewers, setTotalViewers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_POD_URL}/api/redis/get/hash/videoId`
        );
        const rawData = Object.values(response.data)
          .map((item) => JSON.parse(item))
          // 카테고리가 'n'이 아니면서 concurrentViewers가 존재하는 것만 필터링
          .filter((video) => video.concurrentViewers && video.category !== 'n');

        const categoryCounts = rawData.reduce((acc, video) => {
          const category = video.category || "기타";
          acc[category] = (acc[category] || 0) + parseInt(video.concurrentViewers, 10);
          return acc;
        }, {});

        const total = Object.values(categoryCounts).reduce(
          (sum, count) => sum + count,
          0
        );

        const formattedCategories = Object.entries(categoryCounts).map(
          ([name, viewers], index) => ({
            name,
            viewers,
            percentage: ((viewers / total) * 100).toFixed(2),
            color: predefinedColors[index % predefinedColors.length],
          })
        );

        setCategories(formattedCategories);
        setTotalViewers(total);
      } catch (error) {
        console.error("API 요청 실패:", error);
        setError("카테고리 데이터를 불러오는 데 실패했습니다.");
        // 기본 데이터를 사용
        const rawData = fallbackData
          .map((item) => (item !== "{}" ? JSON.parse(item) : {}))
          // fallbackData에서 'n' 카테고리 제외
          .filter((video) => video.concurrentViewers && video.category !== 'n');

        const categoryCounts = rawData.reduce((acc, video) => {
          const category = video.category || "기타";
          acc[category] = (acc[category] || 0) + parseInt(video.concurrentViewers, 10);
          return acc;
        }, {});

        const total = Object.values(categoryCounts).reduce(
          (sum, count) => sum + count,
          0
        );

        const formattedCategories = Object.entries(categoryCounts).map(
          ([name, viewers], index) => ({
            name,
            viewers,
            percentage: ((viewers / total) * 100).toFixed(2),
            color: predefinedColors[index % predefinedColors.length],
          })
        );

        setCategories(formattedCategories);
        setTotalViewers(total);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div className="viewer-category-stats loading">Loading...</div>;
  }

  if (error) {
    return <div className="viewer-category-stats error">{error}</div>;
  }

  return (
    <div className="viewer-category-stats">
      <div className="header">
        <span>번호</span>
        <span>카테고리</span>
        <span>시청자 점유율</span>
        <span>백분위</span>
      </div>
      {categories.map((category, index) => (
        <div key={index} className="category-row">
          <div className="rank">{`#${index + 1}`}</div>
          <div className="category-name">{category.name}</div>
          <div className="progress-bar">
            <div
              className="progress"
              style={{
                width: `${category.percentage}%`,
                backgroundColor: category.color,
                transition: "width 1s ease-in-out",
              }}
              aria-label={`${category.name}: ${category.percentage}%`}
            ></div>
          </div>
          <div className="percentage">{`${category.percentage}%`}</div>
        </div>
      ))}
    </div>
  );
}

export default ViewerCategoryStats;