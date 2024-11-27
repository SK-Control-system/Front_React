import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import "./LikesAndComments.css";
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

const LikesAndComments = () => {
  const [data, setData] = useState([]);
  const MAX_DATA_POINTS = 10;

  // 랜덤 데이터를 생성하여 likes와 comments를 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      const time = new Date().toLocaleTimeString();
      const newPoint = {
        time,
        likes: Math.floor(Math.random() * 100),
        comments: Math.floor(Math.random() * 50),
      };

      setData((prevData) => {
        const updatedData = [...prevData, newPoint];
        return updatedData.length > MAX_DATA_POINTS
          ? updatedData.slice(-MAX_DATA_POINTS)
          : updatedData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // 차트 데이터 구성
  const chartData = {
    labels: data.map((item) => item.time),
    datasets: [
      {
        label: "Likes",
        data: data.map((item) => item.likes),
        borderColor: "#FF6384",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#FF6384",
      },
      {
        label: "Comments",
        data: data.map((item) => item.comments),
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#36A2EB",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#FFFFFF",
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#FFFFFF" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
      y: {
        ticks: { color: "#FFFFFF" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
    },
  };

  return (
      <div className="chart-wrapper">

        <Line data={chartData} options={chartOptions} />
      </div>
  );
};

export default LikesAndComments;
