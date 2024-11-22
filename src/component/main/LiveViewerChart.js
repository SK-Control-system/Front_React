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

// Chart.js에 필요한 플러그인 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function LiveViewerChart({ data }) {
  const chartData = {
    labels: data.map((entry) => entry.time), // x축: 시간
    datasets: [
      {
        label: "시청자 수",
        data: data.map((entry) => entry.viewers), // y축: 시청자 수
        borderColor: "#43FF8C",
        backgroundColor: "rgba(67, 255, 140, 0.2)",
        borderWidth: 2,
        tension: 0.4, // 곡선의 매끄러움
      },
      {
        label: "댓글 수",
        data: data.map((entry) => entry.comments), // y축: 댓글 수
        borderColor: "#4743FF",
        backgroundColor: "rgba(71, 67, 255, 0.2)",
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
          label: (context) => `${context.raw} 명`,
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
      <div className="chart-header">
        <h2>총 시청자 수</h2>
        <div className="chart-controls">
          <div className="legend">
            <div className="legend-item">
              <div className="legend-color" style={{ background: "#4743FF" }}></div>
              댓글 수
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ background: "#43FF8C" }}></div>
              시청자 수
            </div>
          </div>
          <div className="filter">
            <span>시청자 수</span>
            <div className="chevron-down"></div>
          </div>
        </div>
      </div>
      <div className="chart">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}

export default LiveViewerChart;
