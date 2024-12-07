import React, { useEffect, useState } from "react";
import { Doughnut, PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
} from "chart.js";
import axios from "axios";
import "./ViewerReactionChart.css";

// Chart.js에 필요한 모듈 등록
ChartJS.register(ArcElement, Tooltip, Legend, RadialLinearScale);

const ViewerReactionChart = ({ currentDate, videoId }) => {
  const [doughnutStats, setDoughnutStats] = useState({
    veryPositive: 0,
    positive: 0,
    neutral: 0,
    negative: 0,
    veryNegative: 0,
  });

  const [emotionStats, setEmotionStats] = useState({
    joy: 0,
    sadness: 0,
    anger: 0,
    disgust: 0,
    surprise: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSentimentAndEmotionData = async () => {
      try {
        setLoading(true);

        // 긍/부정 데이터 요청
        const sentimentResponse = await axios.post(
          `/api/es/chatting/search/sentiment?index=chatting_youtube_${currentDate}&videoid=${videoId}`,
          { query: { match_all: {} } }
        );

        const sentiments = sentimentResponse.data || []; // 응답이 없을 경우 빈 배열로 처리

        const sentimentCounts = {
          veryPositive: 0,
          positive: 0,
          neutral: 0,
          negative: 0,
          veryNegative: 0,
        };

        if (sentiments.length > 0) {
          sentiments.forEach((sentiment) => {
            switch (sentiment) {
              case "매우 긍정":
                sentimentCounts.veryPositive += 1;
                break;
              case "긍정":
                sentimentCounts.positive += 1;
                break;
              case "중립":
                sentimentCounts.neutral += 1;
                break;
              case "부정":
                sentimentCounts.negative += 1;
                break;
              case "매우 부정":
                sentimentCounts.veryNegative += 1;
                break;
              default:
                break;
            }
          });

          const totalSentiments = sentiments.length || 1;
          setDoughnutStats({
            veryPositive: (sentimentCounts.veryPositive / totalSentiments).toFixed(2),
            positive: (sentimentCounts.positive / totalSentiments).toFixed(2),
            neutral: (sentimentCounts.neutral / totalSentiments).toFixed(2),
            negative: (sentimentCounts.negative / totalSentiments).toFixed(2),
            veryNegative: (sentimentCounts.veryNegative / totalSentiments).toFixed(2),
          });
        }

        // 감성 분석 데이터 요청
        const emotionResponse = await axios.post(
          `/api/es/chatting/search/emotion?index=chatting_youtube_${currentDate}&videoid=${videoId}`,
          { query: { match_all: {} } }
        );

        const emotions = emotionResponse.data || [{}];
        const emotionData = emotions[0] || {};

        setEmotionStats({
          joy: emotionData.joy || 0,
          sadness: emotionData.sadness || 0,
          anger: emotionData.anger || 0,
          disgust: emotionData.disgust || 0,
          surprise: emotionData.surprise || 0,
        });

        setLoading(false);
      } catch (err) {
        console.error("데이터 가져오기 실패:", err);
        setError("데이터를 가져오는 데 실패했습니다.");
        setLoading(false);
      }
    };

    fetchSentimentAndEmotionData();
  }, [currentDate, videoId]);

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

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="emotion-statistics-container">
      {/* 시청자 긍/부정 통계 */}
      <div className="emotion-statistics">
        <h3 className="sentiment-title">시청자의 긍/부정 통계</h3>
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
