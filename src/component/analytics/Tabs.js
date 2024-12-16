import React, { useState } from "react";
import ViewerReactionChart from "./ViewerReactionChart";
import WordCloudComponent from "./WordCloudComponent";
import LikesAndComments from "./LikesAndComments";
import { BarChart2, MessageSquare, ThumbsUp } from 'lucide-react';

const Tabs = ({ currentDate, videoId }) => {
  const [activeTab, setActiveTab] = useState("viewerReaction");

  const tabs = [
    {
      id: "viewerReaction",
      label: "시청자 반응",
      icon: <BarChart2 size={16} />,
      component: <ViewerReactionChart currentDate={currentDate} videoId={videoId} />
    },
    {
      id: "keywordStats",
      label: "키워드",
      icon: <MessageSquare size={16} />,
      component: <WordCloudComponent currentDate={currentDate} videoId={videoId} />
    },
    {
      id: "likesAndComments",
      label: "좋아요 수",
      icon: <ThumbsUp size={16} />,
      component: <LikesAndComments currentDate={currentDate} videoId={videoId} />
    }
  ];

  return (
    <div className="mx-16 mb-20 bg-custom-gray rounded-lg p-4 mt-4">
      <div className="flex items-center gap-4 mb-4 px-2">
        <div className="flex gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-4">
        {tabs.find(tab => tab.id === activeTab)?.component}
      </div>
    </div>
  );
};

export default Tabs;