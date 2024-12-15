import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StatisticsPanel.css";

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

function StatisticsPanel() {
  const [stats, setStats] = useState({
    totalViewers: 0,
    totalLikes: 0,
    totalViewCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_POD_URL}/api/redis/get/hash/videoId`);
        const rawData = Object.values(response.data)
          .map((item) => JSON.parse(item))
          .filter((video) => video.concurrentViewers || video.likeCount || video.viewCount);

        const totalViewers = rawData.reduce(
          (sum, video) => sum + parseInt(video.concurrentViewers || 0, 10),
          0
        );
        const totalLikes = rawData.reduce(
          (sum, video) => sum + parseInt(video.likeCount || 0, 10),
          0
        );
        const totalViewCount = rawData.reduce(
          (sum, video) => sum + parseInt(video.viewCount || 0, 10),
          0
        );

        setStats({ totalViewers, totalLikes, totalViewCount });
      } catch (error) {
        console.error("API 요청 실패:", error);

        const rawData = fallbackData
          .map((item) => (item !== "{}" ? JSON.parse(item) : {}))
          .filter((video) => video.concurrentViewers || video.likeCount || video.viewCount);

        const totalViewers = rawData.reduce(
          (sum, video) => sum + parseInt(video.concurrentViewers || 0, 10),
          0
        );
        const totalLikes = rawData.reduce(
          (sum, video) => sum + parseInt(video.likeCount || 0, 10),
          0
        );
        const totalViewCount = rawData.reduce(
          (sum, video) => sum + parseInt(video.viewCount || 0, 10),
          0
        );

        setStats({ totalViewers, totalLikes, totalViewCount });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="statistics-panel">
      <div className="card card1">
        <div className="card-header">전체 시청자 수</div>
        <div className="card-row">
          <div className="card-content">{stats.totalViewers.toLocaleString()} 명</div>
          {/* <div className="card-percentage positive">
            +11.01% <span className="arrow">⬆</span>
          </div> */}
        </div>
      </div>
      <div className="card card2">
        <div className="card-header">전체 조회 수</div>
        <div className="card-row">
          <div className="card-content">{stats.totalViewCount.toLocaleString()} 명</div>
          {/* <div className="card-percentage negative">
            -0.03% <span className="arrow">⬇</span>
          </div> */}
        </div>
      </div>
      <div className="card card1">
        <div className="card-header">전체 좋아요 수</div>
        <div className="card-row">
          <div className="card-content">{stats.totalLikes.toLocaleString()} 개</div>
          {/* <div className="card-percentage positive">
            +15.03% <span className="arrow">⬆</span>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default StatisticsPanel;
