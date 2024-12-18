import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SubscribedChannelList.css";

const fallbackData = [
  "{\"channelPublishedAt\":\"'n'\",\"videoId\":\"pEi2lBrLt3g\",\"actualStartTime\":\"2024-12-05 04:08:30\",\"channelThumbnailUrl\":\"'n'\",\"viewCount\":\"327025\",\"channelDescription\":\"'n'\",\"likeCount\":\"10869\",\"videoTitle\":\"‘재형이의 썸씽\",\"channelAPIReceivedTime\":\"'n'\",\"categoryAPIReceivedTime\":\"2024-12-06 15:35:47\",\"category\":\"game\",\"channelSubscriberCount\":\"'n'\",\"channelId\":\"UCF5Wkdo3inmxP-Y59wXDsFw\",\"videoAPIReceivedTime\":\"2024-12-06 15:36:50\",\"videoThumbnailUrl\":\"https://i.ytimg.com/vi/YPTxG3t53FU/hqdefault_live.jpg\",\"concurrentViewers\":\"6937\",\"channelTitle\":\"재형이당\",\"actualEndTime\":\"'n'\",\"channelViewCount\":\"'n'\"}",
];

function SubscribedChannelList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/redis/get/hash/videoId");
        const rawData = Object.values(response.data)
          .map((item) => JSON.parse(item))
          // 카테고리가 'n'이 아니면서 concurrentViewers가 존재하는 것만 필터링
          .filter((video) => video.concurrentViewers && video.category !== 'n');

        const categoryCounts = rawData.reduce((acc, video) => {
          const category = video.category || "기타";
          acc[category] = (acc[category] || 0) + parseInt(video.concurrentViewers, 10);
          return acc;
        }, {});

        const totalViewers = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0);

        const formattedCategories = Object.entries(categoryCounts).map(
          ([name, viewers]) => ({
            name,
            percentage: ((viewers / totalViewers) * 100).toFixed(2),
            color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // 랜덤 색상
          })
        );

        setCategories(formattedCategories);
      } catch (error) {
        console.error("API 요청 실패:", error);

        const rawData = fallbackData
          .map((item) => (item !== "{}" ? JSON.parse(item) : {}))
          // fallbackData에서 'n' 카테고리 제외
          .filter((video) => video.concurrentViewers && video.category !== 'n');

        const categoryCounts = rawData.reduce((acc, video) => {
          const category = video.category || "기타";
          acc[category] = (acc[category] || 0) + parseInt(video.concurrentViewers, 10);
          return acc;
        }, {});

        const totalViewers = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0);

        const formattedCategories = Object.entries(categoryCounts).map(
          ([name, viewers]) => ({
            name,
            percentage: ((viewers / totalViewers) * 100).toFixed(2),
            color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
          })
        );

        setCategories(formattedCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
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
          <div className="rank">{`#0${index + 1}`}</div>
          <div className="category-name">{category.name}</div>
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${category.percentage}%`, backgroundColor: category.color }}
            ></div>
          </div>
          <div className="percentage">{`${category.percentage}%`}</div>
        </div>
      ))}
    </div>
  );
}

export default SubscribedChannelList;
