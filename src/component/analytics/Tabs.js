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
      icon: <BarChart2 size={18} />,
      component: <ViewerReactionChart currentDate={currentDate} videoId={videoId} />
    },
    {
      id: "keywordStats",
      label: "키워드",
      icon: <MessageSquare size={18} />,
      component: <WordCloudComponent currentDate={currentDate} videoId={videoId} />
    },
    {
      id: "likesAndComments",
      label: "좋아요 수",
      icon: <ThumbsUp size={18} />,
      component: <LikesAndComments currentDate={currentDate} videoId={videoId} />
    }
  ];

  return (
    <div className="mx-16 mb-20 bg-custom-gray rounded-lg p-4 mt-4">
      <div className="flex items-center justify-start gap-1 border-b border-gray-700 px-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2 text-sm font-medium
              transition-colors duration-200 relative
              ${activeTab === tab.id 
                ? 'text-white' 
                : 'text-gray-400 hover:text-gray-200'}
            `}
          >
            {tab.icon}
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500" />
            )}
          </button>
        ))}
      </div>
      
      <div className="mt-4 px-4 pb-4">
        {tabs.find(tab => tab.id === activeTab)?.component}
      </div>
    </div>
  );
};

export default Tabs;