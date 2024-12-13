import React from "react";
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

function LiveViewerChart({ viewerData }) {
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
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw.toLocaleString()} 명`,
        },
      },
    },
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true },
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
