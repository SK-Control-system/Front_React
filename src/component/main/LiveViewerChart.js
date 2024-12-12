import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
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
import axios from "axios";
import "./LiveViewerChart.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function LiveViewerChart() {
  const [viewerData, setViewerData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchViewerData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_POD_URL}/api/redis/get/hash/videoId`);

        const rawData = Object.values(response.data)
          .map((item) => JSON.parse(item))
          .filter((video) => video.concurrentViewers);

        const totalViewers = rawData.reduce(
          (sum, video) => sum + parseInt(video.concurrentViewers, 10),
          0
        );

        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setViewerData((prevData) => [...prevData, { time: currentTime, viewers: totalViewers }]);
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchViewerData();

    const interval = setInterval(() => {
      fetchViewerData();
    }, 60000); // 1분마다 호출

    return () => clearInterval(interval);
  }, []);

  if (loading && viewerData.length === 0) {
    return <div>Loading...</div>;
  }

  const chartData = {
    labels: viewerData.map((entry) => entry.time),
    datasets: [
      {
        label: "총 시청자 수",
        data: viewerData.map((entry) => entry.viewers),
        borderColor: "#43FF8C",
        backgroundColor: "rgba(67, 255, 140, 0.2)",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#FFFFFF",
          font: {
            family: "NanumSquare Neo OTF",
            size: 14,
            weight: 700,
          },
        },
      },
      tooltip: {
        backgroundColor: "#FFFFFF",
        titleColor: "#000000",
        bodyColor: "#000000",
        borderColor: "#3B3B3B",
        borderWidth: 1,
        callbacks: {
          label: (context) => `${context.raw.toLocaleString()} 명`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "#3B3B3B",
        },
        ticks: {
          color: "#7C8DB5",
          font: {
            family: "NanumSquare Neo OTF",
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: "#3B3B3B",
        },
        ticks: {
          color: "#7C8DB5",
          font: {
            family: "NanumSquare Neo OTF",
            size: 12,
          },
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="chart-container">
      <h2>1분 단위 총 시청자 수</h2>
      <div className="chart">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}

export default LiveViewerChart;
