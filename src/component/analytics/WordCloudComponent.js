import React, { useEffect, useRef } from "react";
import axios from "axios";
import WordCloud from "wordcloud";
import "./WordCloudComponent.css";

const WordCloudComponent = ({ currentDate, videoId }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchDataAndRenderWordCloud = async () => {
      const canvas = canvasRef.current;

      // 부모 컨테이너 크기를 기준으로 캔버스 크기 설정
      const dpr = window.devicePixelRatio || 1; // 디바이스 픽셀 밀도 가져오기
      const containerWidth = canvas.parentElement.offsetWidth;
      const containerHeight = 400; // 고정 높이 설정 (필요시 변경 가능)

      // 캔버스의 CSS 크기 설정
      canvas.style.width = "100%";
      canvas.style.maxWidth = "900px";
      canvas.style.height = `${containerHeight}px`;

      // 캔버스의 실제 크기를 픽셀 밀도에 맞게 설정
      canvas.width = containerWidth * dpr;
      canvas.height = containerHeight * dpr;

      const ctx = canvas.getContext("2d");
      ctx.scale(dpr, dpr); // DPI 보정

      // const currentDate = "2024-12-07"; // 현재 날짜
      // const videoId = "V3LrXor2WwQ"; // 비디오 ID
      //tab.js에서 props로 currentDate와 videoID 받아오기로 로직수정.

      try {
        // API 요청
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_POD_URL}/api/es/chatting/wordCloud?index=chatting_youtube_${currentDate}&videoid=${videoId}`,
          {
            size: 0,
            query: {
              term: {
                videoId: videoId,
              },
            },
            aggs: {
              top_keywords: {
                terms: {
                  field: "message",
                  size: 10000,
                  order: {
                    _count: "desc",
                  },
                },
              },
            },
          }
        );
        console.log("currentDate:", currentDate, "videoId:", videoId);

        // 응답 데이터 파싱
        const wordList = response.data.map((item) => [item.key, item.doc_count]);

        // WordCloud 생성
        WordCloud(canvas, {
          list: wordList,
          gridSize: Math.max(8, Math.floor(containerWidth / 100)), // 단어 간격
          weightFactor: Math.min(containerWidth, containerHeight) / 200, // 단어 크기 비율
          fontFamily: "NanumSquare Neo OTF, sans-serif",
          color: () => `#${Math.floor(Math.random() * 16777215).toString(16)}`, // 랜덤 색상
          rotationSteps: 5, // 회전 각도
          backgroundColor: "#303030", // 배경색
          origin: [containerWidth / 2, containerHeight / 2], // 캔버스 중심을 기준으로 렌더링
        });
      } catch (error) {
        console.error("WordCloud API 요청 실패:", error);
      }
    };

    fetchDataAndRenderWordCloud();
  }, [currentDate, videoId]); // date와 videoId가 변경될 때마다 호출

  return (
    <canvas
      ref={canvasRef}
      className="wordcloud-canvas"
      style={{
        width: "100%",
        maxWidth: "900px",
        height: "400px",
      }}
    ></canvas>
  );
};

export default WordCloudComponent;
