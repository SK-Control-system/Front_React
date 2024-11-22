import React from "react";
import { Line } from "react-chartjs-2";
import "../analytics/EmotionTrendChart.css";
import "../../App.css";
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

const EmotionTrendChart = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.time), // x축: 시간
    datasets: [
      {
        label: "매우 긍정",
        data: data.map((item) => item.veryPositive),
        borderColor: "#2E7D32",
        backgroundColor: "rgba(46, 125, 50, 0.2)",
        borderWidth: 2,
        tension: 0.4, //그래프줄의 텐션
        pointRadius: 0, //포인트점안보이게
      },
      {
        label: "긍정",
        data: data.map((item) => item.positive),
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: "중립",
        data: data.map((item) => item.neutral),
        borderColor: "#FFD700",
        backgroundColor: "rgba(255, 215, 0, 0.2)",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: "부정",
        data: data.map((item) => item.negative),
        borderColor: "#F44336",
        backgroundColor: "rgba(244, 67, 54, 0.2)",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: "매우 부정",
        data: data.map((item) => item.veryNegative),
        borderColor: "#B71C1C",
        backgroundColor: "rgba(183, 28, 28, 0.2)",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 800, // 애니메이션 시간 (ms)
      easing: "easeInOutQuad", // 애니메이션 곡선
    },
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
    // <div className="chart-container">
    <div className="adfasfsd">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default EmotionTrendChart;
