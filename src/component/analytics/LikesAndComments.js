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
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LikesAndComments = ({ currentDate, videoId }) => {
  const [data, setData] = useState([]); // 실제 데이터를 저장할 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_POD_URL}/api/es/video/search/searchConcurrentViewersWithTime?index=video_youtube_${currentDate}&videoid=${videoId}`)
        console.log(response.data)
      } catch (err) {
        console.error(err)
      }
    }
    getData();
  }, [currentDate, videoId]);

  // 실제 데이터를 가져오는 함수
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_POD_URL}/api/es/video/search/likeCount?index=video_youtube_${currentDate}&videoid=${videoId}`
        );

        const timeResponse = await axios.post(`${process.env.REACT_APP_BACKEND_POD_URL}/api/es/video/search/searchConcurrentViewersWithTime?index=video_youtube_${currentDate}&videoid=${videoId}`);

        // 데이터 파싱 및 가공
        const timestamps = timeResponse.data; // 받아온 데이터 (시간 정보)
        const likeCounts = response.data; // 좋아요 수

        // 차트 데이터 구성
        const chartData = {
          time: timestamps.map((time) =>
            new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          ), // 시간 레이블 (HH:mm 형식)
          likes: likeCounts,
        };

        setData(chartData); // 상태 업데이트
        setLoading(false); // 로딩 완료
      } catch (err) {
        console.error("데이터 가져오기 실패:", err);
        setError(err.message); // 에러 상태 업데이트
        setLoading(false); // 로딩 완료
      }
    };

    fetchData();
  }, [currentDate, videoId]); // currentDate와 videoId가 변경될 때마다 데이터 다시 가져오기

  // 차트 데이터 구성
  const chartData = {
    labels: data.time || [], // 시간 레이블
    datasets: [
      {
        label: "Likes",
        data: data.likes || [], // 좋아요 데이터
        borderColor: "#FF6384",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#FF6384",
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

  // 로딩 및 에러 처리
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="chart-wrapper">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default LikesAndComments;