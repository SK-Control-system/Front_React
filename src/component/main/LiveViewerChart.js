import React, { useState } from "react";
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

function LiveViewerChart({ data }) {
  const [selectedMetric, setSelectedMetric] = useState("viewers"); // 기본값: '시청자 수'
  const [dropdownOpen, setDropdownOpen] = useState(false); // 드롭다운 열림 상태

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev); // 드롭다운 열림/닫힘 토글
  };

  const handleMetricChange = (metric) => {
    setSelectedMetric(metric); // 선택한 메트릭으로 변경
    setDropdownOpen(false); // 드롭다운 닫기
  };

  const chartData = {
    labels: data.map((entry) => entry.time),
    datasets: [
      {
        label: selectedMetric === "viewers" ? "시청자 수" : "댓글 수",
        data: data.map((entry) =>
          selectedMetric === "viewers" ? entry.viewers : entry.comments
        ),
        borderColor: selectedMetric === "viewers" ? "#43FF8C" : "#4743FF",
        backgroundColor:
          selectedMetric === "viewers"
            ? "rgba(67, 255, 140, 0.2)"
            : "rgba(71, 67, 255, 0.2)",
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
        <h2>{selectedMetric === "viewers" ? "총 시청자 수" : "총 댓글 수"}</h2>
        <div className="filter">
          <span onClick={toggleDropdown}>
            {selectedMetric === "viewers" ? "시청자 수 ▼" : "댓글 수 ▼"}
          </span>
          <div className={`dropdown ${dropdownOpen ? "open" : ""}`}>
            <div
              className="dropdown-item"
              onClick={() => handleMetricChange("viewers")}
            >
              <span className="dropdown-icon">👥</span> 시청자 수
            </div>
            <div
              className="dropdown-item"
              onClick={() => handleMetricChange("comments")}
            >
              <span className="dropdown-icon">💬</span> 댓글 수
            </div>
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
