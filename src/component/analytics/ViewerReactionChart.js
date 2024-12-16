// ViewerReactionChart.js
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
import { FaSmile, FaHeartBroken } from "react-icons/fa"; // 아이콘 추가

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
    confusion: 0, // 혼란 추가
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSentimentAndEmotionData = async () => {
      try {
        setLoading(true);

        // 긍/부정 데이터 요청
        const sentimentResponse = await axios.post(
          `${process.env.REACT_APP_BACKEND_POD_URL}/api/es/chatting/search/sentiment?index=chatting_youtube_${currentDate}&videoid=${videoId}`
        );

        const sentiments = sentimentResponse.data || [];
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
          `${process.env.REACT_APP_BACKEND_POD_URL}/api/es/chatting/search/emotion?index=chatting_youtube_${currentDate}&videoid=${videoId}`
        );

        const emotions = emotionResponse.data || [];
        const emotionCounts = {
          joy: 0,
          sadness: 0,
          anger: 0,
          disgust: 0,
          surprise: 0,
          confusion: 0,
        };

        if (emotions.length > 0) {
          emotions.forEach((emotion) => {
            switch (emotion) {
              case "기쁨":
                emotionCounts.joy += 1;
                break;
              case "슬픔":
                emotionCounts.sadness += 1;
                break;
              case "분노":
                emotionCounts.anger += 1;
                break;
              case "혐오":
                emotionCounts.disgust += 1;
                break;
              case "놀람":
                emotionCounts.surprise += 1;
                break;
              case "혼란":
                emotionCounts.confusion += 1;
                break;
              default:
                console.warn("알 수 없는 감정 데이터:", emotion);
                break;
            }
          });

          setEmotionStats(emotionCounts);
        }

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
          "#4ADE80", // 매우 긍정
          "#2DD4BF", // 긍정
          "#FBBF24", // 중립
          "#FB7185", // 부정
          "#F43F5E", // 매우 부정
        ],
        borderWidth: 0,
        borderRadius: 5,
        spacing: 3,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: "bottom",
        align: "center",
        labels: {
          color: "#9CA3AF",
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 12,
            family: "'Pretendard', sans-serif",
          }
        }
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 13,
          family: "'Pretendard', sans-serif",
        },
        bodyFont: {
          size: 12,
          family: "'Pretendard', sans-serif",
        },
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            return ` ${context.label}: ${(context.raw * 100).toFixed(1)}%`;
          }
        }
      }
    },
  };

  // Polar Area Chart 데이터
  const polarAreaData = {
    labels: ["기쁨", "슬픔", "분노", "혐오", "놀람", "혼란"],
    datasets: [
      {
        data: [
          emotionStats.joy,
          emotionStats.sadness,
          emotionStats.anger,
          emotionStats.disgust,
          emotionStats.surprise,
          emotionStats.confusion,
        ],
        backgroundColor: [
          "#60A5FA", // 기쁨
          "#34D399", // 슬픔
          "#FBBF24", // 분노
          "#F87171", // 혐오
          "#A78BFA", // 놀람
          "#9CA3AF", // 혼란
        ],
        borderWidth: 0,
      },
    ],
  };

  const polarAreaOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        align: "center",
        labels: {
          color: "#9CA3AF",
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 12,
            family: "'Pretendard', sans-serif",
          }
        }
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 13,
          family: "'Pretendard', sans-serif",
        },
        bodyFont: {
          size: 12,
          family: "'Pretendard', sans-serif",
        },
        cornerRadius: 8,
      }
    },
    scales: {
      r: {
        ticks: {
          color: "#9CA3AF",
          backdropColor: "transparent",
          font: {
            size: 11,
          }
        },
        grid: {
          color: "rgba(255, 255, 255, 0.06)",
        },
        angleLines: {
          color: "rgba(255, 255, 255, 0.06)",
        }
      },
    },
  };

  if (loading) return <div className="mx-12 p-4 text-gray-400">로딩 중...</div>;
  if (error) return <div className="mx-12 p-4 text-red-400">{error}</div>;

  return (
    <div className="mx-12 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 긍/부정 통계 그래프 */}
        <div className="bg-sentiment rounded-lg p-6 shadow-lg">
          <h3 className="flex items-center text-lg font-medium text-white mb-6">
            <FaHeartBroken className="mr-2" /> 시청자의 긍/부정 통계
          </h3>
          <div className="h-[300px]">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>

        {/* 감성 통계 그래프 */}
        <div className="bg-emotion rounded-lg p-6 shadow-xl">
          <h3 className="flex items-center text-lg font-medium text-white mb-6">
            <FaSmile className="mr-2" /> 시청자의 감성 통계
          </h3>
          <div className="h-[300px]">
            <PolarArea data={polarAreaData} options={polarAreaOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewerReactionChart;