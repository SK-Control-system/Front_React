import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { BarChart2, Users } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const EmotionTrendChart = ({ data, currentDate, videoId }) => {
  const [selectedChart, setSelectedChart] = useState("emotionTrend");
  const [viewerData, setViewerData] = useState({ labels: [], data: [] });

  const formatTime = (time) => {
    return new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const groupDataByMinute = (data) => {
    const groupedData = {};
    data.forEach((item) => {
      const time = formatTime(item.time);
      if (!groupedData[time]) {
        groupedData[time] = {
          time,
          veryPositive: 0,
          positive: 0,
          neutral: 0,
          negative: 0,
          veryNegative: 0,
        };
      }
      groupedData[time].veryPositive += item.veryPositive;
      groupedData[time].positive += item.positive;
      groupedData[time].neutral += item.neutral;
      groupedData[time].negative += item.negative;
      groupedData[time].veryNegative += item.veryNegative;
    });
    return Object.values(groupedData);
  };

  const groupedData = groupDataByMinute(data);

  const emotionTrendData = {
    labels: groupedData.map((item) => item.time),
    datasets: [
      {
        label: "매우 긍정",
        data: groupedData.map((item) => item.veryPositive),
        borderColor: "#4ADE80",
        backgroundColor: "rgba(74, 222, 128, 0.3)",
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      },
      {
        label: "긍정",
        data: groupedData.map((item) => item.positive),
        borderColor: "#2DD4BF",
        backgroundColor: "rgba(45, 212, 191, 0.3)",
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      },
      {
        label: "중립",
        data: groupedData.map((item) => item.neutral),
        borderColor: "#FBBF24",
        backgroundColor: "rgba(251, 191, 36, 0.3)",
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      },
      {
        label: "부정",
        data: groupedData.map((item) => item.negative),
        borderColor: "#FB7185",
        backgroundColor: "rgba(251, 113, 133, 0.3)",
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      },
      {
        label: "매우 부정",
        data: groupedData.map((item) => item.veryNegative),
        borderColor: "#F43F5E",
        backgroundColor: "rgba(244, 63, 94, 0.3)",
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  useEffect(() => {
    const fetchViewerData = async () => {
      try {
        const [timeResponse, viewerResponse] = await Promise.all([
          axios.post(
            `${process.env.REACT_APP_BACKEND_POD_URL}/api/es/video/search/concurrentViewersWithTime?index=video_youtube_${currentDate}&videoid=${videoId}`
          ),
          axios.post(
            `${process.env.REACT_APP_BACKEND_POD_URL}/api/es/video/search/concurrentViewers?index=video_youtube_${currentDate}&videoid=${videoId}`
          )
        ]);

        const minLength = Math.min(timeResponse.data.length, viewerResponse.data.length);
        const formattedTimestamps = timeResponse.data
          .slice(0, minLength)
          .map(formatTime);

        setViewerData({
          labels: formattedTimestamps,
          data: viewerResponse.data.slice(0, minLength),
        });
      } catch (error) {
        console.error("시청자 수 데이터 가져오기 실패:", error);
      }
    };

    fetchViewerData();
  }, [currentDate, videoId]);

  const viewerChartData = {
    labels: viewerData.labels,
    datasets: [
      {
        label: "실시간 시청자 수",
        data: viewerData.data,
        borderColor: "#60A5FA",
        backgroundColor: "rgba(96, 165, 250, 0.3)",
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
        align: "start",
        labels: {
          color: "#FFFFFF",
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: "'Pretendard', sans-serif",
          }
        }
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: {
          size: 13,
          family: "'Pretendard', sans-serif",
        },
        bodyFont: {
          size: 12,
          family: "'Pretendard', sans-serif",
        },
        padding: 12,
        cornerRadius: 8,
      }
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.06)",
        },
        ticks: {
          color: "#9CA3AF",
          font: {
            size: 11,
            family: "'Pretendard', sans-serif",
          }
        }
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.06)",
        },
        ticks: {
          color: "#9CA3AF",
          font: {
            size: 11,
            family: "'Pretendard', sans-serif",
          }
        }
      }
    }
  };

  return (
    <div className="mx-16 mb-12 bg-custom-gray rounded-lg p-4">
      <div className="flex items-center gap-4 mb-4 px-2">
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedChart("emotionTrend")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              selectedChart === "emotionTrend"
                ? "bg-blue-500 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <BarChart2 size={16} />
            감정 트렌드
          </button>
          <button
            onClick={() => setSelectedChart("viewerChart")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              selectedChart === "viewerChart"
                ? "bg-blue-500 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Users size={16} />
            시청자 수
          </button>
        </div>
      </div>
      
      <div className="h-[360px] p-2">
        <Line
          data={selectedChart === "emotionTrend" ? emotionTrendData : viewerChartData}
          options={options}
        />
      </div>
    </div>
  );
};

export default EmotionTrendChart;