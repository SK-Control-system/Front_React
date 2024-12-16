import React, { useState, useEffect } from 'react';
import { UserCircle, Users, Clock, Calendar } from 'lucide-react';

const BroadcastProfile = ({ videoId, currentDate }) => {
  const [broadcastData, setToBroadcastData] = useState(null);

  useEffect(() => {
    const fetchBroadcastData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_POD_URL}/api/redis/get/hash/videoId`
        );
        const data = await response.json();
        const broadcasts = Object.values(data).map(item => JSON.parse(item));
        const currentBroadcast = broadcasts.find(broadcast => broadcast.videoId === videoId);
        setToBroadcastData(currentBroadcast);
      } catch (error) {
        console.error("Error fetching broadcast data:", error);
      }
    };

    fetchBroadcastData();
  }, [videoId]);

  if (!broadcastData) return <div>Loading...</div>;

  return (
    <div className="w-full bg-custom-gray rounded-lg p-4 mb-3">
      <div className="flex items-center gap-3">
        <img
          src={broadcastData.channelThumbnailUrl || "https://via.placeholder.com/60"}
          alt="Channel Profile"
          className="w-16 h-16 rounded-full"
        />
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-semibold text-white truncate">
            {broadcastData.channelTitle}
          </h2>
          <h3 className="text-sm text-gray-300 mb-2 truncate">
            {broadcastData.videoTitle}
          </h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <div className="flex items-center gap-1.5 text-gray-300">
              <Users size={14} />
              <span className="truncate">{broadcastData.concurrentViewers || 0} 시청중</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-300">
              <Clock size={14} />
              <span className="truncate">{broadcastData.actualStartTime || "시간 정보 없음"}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-300">
              <UserCircle size={14} />
              <span className="truncate">{broadcastData.category || "카테고리 없음"}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-300">
              <Calendar size={14} />
              <span className="truncate">{currentDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BroadcastProfile;