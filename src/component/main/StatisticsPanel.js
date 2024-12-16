import React, { useEffect, useState } from "react";
import axios from "axios";

function StatisticsPanel() {
  const [stats, setStats] = useState({
    totalViewers: 35723,
    totalLikes: 4039885,
    totalViewCount: 0,
    totalComments: 450,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_POD_URL}/api/redis/get/hash/videoId`
        );
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

        setStats({
          totalViewers,
          totalLikes,
          totalViewCount,
          totalComments: 450,
        });
      } catch (error) {
        console.error("API 요청 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lg text-white">Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto p-4">
      <StatCard title="전체 시청자 수" value={stats.totalViewers} unit="명" change="11.01%" isPositive={true} />
      <StatCard title="전체 조회 수" value={stats.totalViewCount} unit="회" change="-0.03%" isPositive={false} />
      <StatCard title="전체 좋아요 수" value={stats.totalLikes} unit="개" change="15.03%" isPositive={true} />
      <StatCard title="전체 댓글 수" value={stats.totalComments} unit="개" change="6.08%" isPositive={true} />
    </div>
  );
}

function StatCard({ title, value, unit, change, isPositive }) {
  return (
    <div className="bg-custom-gray text-white rounded-xl p-4 flex flex-col justify-between min-h-[140px]">
      <h2 className="text-zinc-400 text-sm font-medium">{title}</h2>
      <div className="flex flex-col space-y-2">
        <div className="flex items-baseline">
          <span className="text-2xl lg:text-3xl font-bold">{value.toLocaleString()}</span>
          <span className="text-zinc-500 text-base ml-2">{unit}</span>
        </div>
        <div
          className={`self-start text-sm font-medium px-2 py-1 rounded-full ${
            isPositive ? "bg-green-600/20 text-green-400" : "bg-red-600/20 text-red-400"
          }`}
        >
          {isPositive ? "▲" : "▼"} {change}
        </div>
      </div>
    </div>
  );
}

export default StatisticsPanel;