import React, { useState } from "react";
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
  const [selectedChart, setSelectedChart] = useState("emotionTrend"); // 기본값: 감정 트렌드
  const [dropdownOpen, setDropdownOpen] = useState(false); // 드롭다운 열림 상태

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev); // 드롭다운 열림/닫힘 토글
  };

  const handleChartChange = (chart) => {
    setSelectedChart(chart); // 선택한 차트로 변경
    setDropdownOpen(false); // 드롭다운 닫기
  };

  // 시간 데이터를 HH:mm 형식으로 변환
  const formatTime = (time) => {
    return new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // 데이터 그룹화
  const groupDataByMinute = (data) => {
    const groupedData = {};

    data.forEach((item) => {
      const time = formatTime(item.time); // HH:mm 형식으로 변환
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

  // 그룹화된 데이터
  const groupedData = groupDataByMinute(data);

  const emotionTrendData = {
    labels: groupedData.map((item) => item.time),
    datasets: [
      {
        label: "매우 긍정",
        data: groupedData.map((item) => item.veryPositive),
        borderColor: "#2E7D32",
        backgroundColor: "rgba(46, 125, 50, 0.2)",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: "긍정",
        data: groupedData.map((item) => item.positive),
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: "중립",
        data: groupedData.map((item) => item.neutral),
        borderColor: "#FFD700",
        backgroundColor: "rgba(255, 215, 0, 0.2)",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: "부정",
        data: groupedData.map((item) => item.negative),
        borderColor: "#F44336",
        backgroundColor: "rgba(244, 67, 54, 0.2)",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: "매우 부정",
        data: groupedData.map((item) => item.veryNegative),
        borderColor: "#B71C1C",
        backgroundColor: "rgba(183, 28, 28, 0.2)",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const dummyChartData = {
    labels: groupedData.map((item) => item.time),
    datasets: [
      {
        label: "실시간 시청자 수",
        data: groupedData.map(() => Math.random() * 100), // 더미 데이터
        borderColor: "#FF5733",
        backgroundColor: "rgba(255, 87, 51, 0.2)",
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
      duration: 800,
      easing: "easeInOutQuad",
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
    <div className="chart-container">
      <div className="chart-header">
        <div className="filter">
          <span onClick={toggleDropdown}>
            {selectedChart === "emotionTrend" ? "감정 트렌드 ▼" : "시청자 수 ▼"}
          </span>
          <div className={`dropdown ${dropdownOpen ? "open" : ""}`}>
            <div
              className="dropdown-item"
              onClick={() => handleChartChange("emotionTrend")}
            >
              <span className="dropdown-icon"></span> 감정 트렌드
            </div>
            <div
              className="dropdown-item"
              onClick={() => handleChartChange("dummyChart")}
            >
              <span className="dropdown-icon"></span>시청자 수 
            </div>
          </div>
        </div>
      </div>
      <div className="chart">
        <Line
          data={selectedChart === "emotionTrend" ? emotionTrendData : dummyChartData}
          options={options}
        />
      </div>
    </div>
  );
};

export default EmotionTrendChart;