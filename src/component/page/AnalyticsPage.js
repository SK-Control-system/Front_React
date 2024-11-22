import React, { useEffect, useState } from "react";
import Tabs from "../analytics/Tabs";
import ViewerReactionChart from "../analytics/ViewerReactionChart";
import EmotionTrendChart from "../analytics/EmotionTrendChart";
const AnalyticsPage = () => {
  const [emotionData, setEmotionData] = useState([]);
  const [activeTab, setActiveTab] = useState("viewerReaction");

  useEffect(() => {
    const MAX_DATA_POINTS = 10;

    const fetchEmotionData = async () => {
      const time = new Date().toLocaleTimeString();

      const newData = {
        time,
        veryPositive: Math.random() * 0.6,
        positive: Math.random() * 0.4,
        neutral: Math.random() * 0.3,
        negative: Math.random() * 0.4,
        veryNegative: Math.random() * 0.2,
      };

      setEmotionData((prevData) => {
        const updatedData = [...prevData, newData];
        return updatedData.length > MAX_DATA_POINTS
          ? updatedData.slice(-MAX_DATA_POINTS)
          : updatedData;
      });
    };

    const interval = setInterval(fetchEmotionData, 2000);

    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "viewerReaction":
        return (
          <ViewerReactionChart
            data={emotionData[emotionData.length - 1] || {
              veryPositive: 0,
              positive: 0,
              neutral: 0,
              negative: 0,
              veryNegative: 0,
            }}
          />
        );
      case "keywordStats":
        return <div>키워드 관련 내용</div>;
      case "likesAndComments":
        return <div>좋아요 & 댓글 내용</div>;
      default:
        return null;
    }
  };

  return (
    <div className="analytics-container">
      <EmotionTrendChart data={emotionData} />
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="tab-content">{renderContent()}</div>
    </div>
  );
};

export default AnalyticsPage;
