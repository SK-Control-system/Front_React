import React, { useEffect, useRef } from "react";
import WordCloud from "wordcloud";
import "./WordCloudComponent.css";

const WordCloudComponent = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
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

    // WordCloud 생성
    WordCloud(canvas, {
      list: [
        ["React", 38],
        ["JavaScript", 30],
        ["CSS", 28],
        ["HTML", 25],
        ["Node.js", 20],
        ["Express", 18],
        ["MongoDB", 15],
        ["GraphQL", 14],
        ["AWS", 10],
        ["Docker", 8],
        ["Jquery", 38],
        ["AI", 30],
        ["Git", 28],
        ["CI&CD", 25],
        ["npm", 20],
        ["EKS", 18],
        ["REDIS", 15],
        ["Kafka", 14],
        ["AWS", 10],
        ["Docker", 8]
      ],
      gridSize: Math.max(8, Math.floor(containerWidth / 100)), // 단어 간격
      weightFactor: Math.min(containerWidth, containerHeight) / 200, // 단어 크기 비율
      fontFamily: "NanumSquare Neo OTF, sans-serif",
      color: () => `#${Math.floor(Math.random() * 16777215).toString(16)}`, // 랜덤 색상
      // rotateRatio: 0.5, // 단어 회전 비율
      rotationSteps: 5, // 회전 각도
      backgroundColor: "#303030", // 배경색
      origin: [containerWidth / 2, containerHeight / 2], // 캔버스 중심을 기준으로 렌더링
    });
  }, []);

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
