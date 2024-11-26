import React, { useEffect, useState } from "react";
import { Doughnut, PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale, // RadialLinearScale 추가
} from "chart.js";
import "./ViewerReactionChart.css";

// Chart.js에 필요한 모듈 등록
ChartJS.register(ArcElement, Tooltip, Legend, RadialLinearScale);

const ViewerReactionChart = () => {
  const [emotionStats, setEmotionStats] = useState({
    joy: 0.25,
    sadness: 0.23,
    anger: 0.15,
    disgust: 0.13,
    surprise: 0.11,
  });

  const [doughnutStats, setDoughnutStats] = useState({
    veryPositive: 0.3,
    positive: 0.5,
    neutral: 0.2,
    negative: 0.15,
    veryNegative: 0.1,
  });

  // 감성 통계 랜덤 업데이트
  useEffect(() => {
    const updateEmotionStats = () => {
      setEmotionStats({
        joy: Math.random().toFixed(2),
        sadness: Math.random().toFixed(2),
        anger: Math.random().toFixed(2),
        disgust: Math.random().toFixed(2),
        surprise: Math.random().toFixed(2),
      });

      setDoughnutStats({
        veryPositive: Math.random().toFixed(2),
        positive: Math.random().toFixed(2),
        neutral: Math.random().toFixed(2),
        negative: Math.random().toFixed(2),
        veryNegative: Math.random().toFixed(2),
      });
    };

    const interval = setInterval(updateEmotionStats, 2000); // 2초마다 업데이트
    return () => clearInterval(interval);
  }, []);

  // Doughnut Chart 데이터
  const doughnutData = {
    labels: ["매우 긍정", "긍정", "중립", "부정", "매우 부정"],
    datasets: [
      {
        data: [
          doughnutStats.veryPositive,
          doughnutStats.positive,
          doughnutStats.neutral,
          doughnutStats.negative,
          doughnutStats.veryNegative,
        ],
        backgroundColor: [
          "#22C55E", // Green
          "#3B82F6", // Blue
          "#EAB308", // Yellow
          "#F97316", // Orange
          "#EF4444", // Red
        ],
        borderWidth: 1,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#FFFFFF",
        },
      },
    },
  };

  // PolarArea Chart 데이터
  const polarAreaData = {
    labels: ["기쁨", "슬픔", "분노", "혐오", "놀람"],
    datasets: [
      {
        data: [
          emotionStats.joy,
          emotionStats.sadness,
          emotionStats.anger,
          emotionStats.disgust,
          emotionStats.surprise,
        ],
        backgroundColor: [
          "#3B82F6", // Blue
          "#22C55E", // Green
          "#EAB308", // Yellow
          "#F97316", // Orange
          "#EF4444", // Red
        ],
        borderWidth: 1,
      },
    ],
  };

  const polarAreaOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#FFFFFF",
        },
      },
    },
    scales: {
      r: {
        ticks: {
          color: "#FFFFFF",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
  };

  return (
    <div className="emotion-statistics-container">
      {/* 시청자 긍/부정 통계 */}
      <div className="emotion-statistics">
        <h3 className="emotion-title">시청자의 긍/부정 통계</h3>
        <Doughnut data={doughnutData} options={doughnutOptions} />
      </div>
      {/* 시청자 감성 통계 */}
      <div className="emotion-statistics">
        <h3 className="emotion-title">시청자의 감성 통계</h3>
        <PolarArea data={polarAreaData} options={polarAreaOptions} />
      </div>
    </div>
  );
};

export default ViewerReactionChart;
