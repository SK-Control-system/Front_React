import React, { useEffect, useState } from "react";
import Tabs from "../analytics/Tabs";
import EmotionTrendChart from "../analytics/EmotionTrendChart";
import ChatBox from "../analytics/ChatBox";

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

//   <div className="좌측">
//   {/* <ChatBox/> */}
// </div>
// <div className="우측">
//   <EmotionTrendChart data={emotionData} />
//   <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
// </div>

  return (
    <div className="analytics-container">
        <EmotionTrendChart data={emotionData} />
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default AnalyticsPage;
