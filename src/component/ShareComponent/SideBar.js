import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaFileAlt,
  FaChartBar,
  FaUsers,
  FaClosedCaptioning,
  FaCopyright,
  FaCog,
} from "react-icons/fa";
import "./SideBar.css";
import { useUser } from "../../provider/UserContext";
import axios from "axios";

const SideBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { userName, userChannelId } = useUser(); // Google 사용자 이름 및 채널 ID 가져오기
  const navigate = useNavigate();

  const handleAnalyticsClick = async (event) => {
    event.preventDefault(); // 기본 링크 동작 방지

    if (!userChannelId) {
      alert("로그인된 사용자 채널 ID를 찾을 수 없습니다.");
      return;
    }

    const youtubeApiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${userChannelId}&eventType=live&type=video&key=${youtubeApiKey}`
      );

      if (response.data.items && response.data.items.length > 0) {
        const video = response.data.items[0]; // 첫 번째 방송 데이터
        const videoId = video.id.videoId;
        const currentDate = new Date().toLocaleDateString("en-CA"); // 현재 날짜 (YYYY-MM-DD)
        navigate(`/analytics/${currentDate}/${videoId}`); // 방송 페이지로 이동
      } else {
        alert("현재 실시간 방송이 진행 중이지 않습니다.");
      }
    } catch (error) {
      console.error("YouTube API 요청 실패:", error);
      alert("방송 데이터를 가져오는 중 문제가 발생했습니다.");
    }
  };

  return (
    <div
      className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <h2 className="channel-name">{userName || "로그인 필요"}</h2>
      <ul className="menu">
        <li>
          <Link to="/">
            <FaHome />
            <span className="menu-text">대시보드</span>
          </Link>
        </li>
        <li>
          <Link to="/content">
            <FaFileAlt />
            <span className="menu-text">콘텐츠</span>
          </Link>
        </li>
        <li>
          <Link
            to="#"
            onClick={handleAnalyticsClick} // 클릭 이벤트 연결
          >
            <FaChartBar />
            <span className="menu-text">실시간 내 방송</span>
          </Link>
        </li>
        <li>
          <Link to="/community">
            <FaUsers />
            <span className="menu-text">내 채널 통계</span>
          </Link>
        </li>
        <li>
          <Link to="/subtitles">
            <FaClosedCaptioning />
            <span className="menu-text">자막</span>
          </Link>
        </li>
        <li>
          <Link to="/copyright">
            <FaCopyright />
            <span className="menu-text">저작권</span>
          </Link>
        </li>
        <li>
          <Link to="/settings">
            <FaCog />
            <span className="menu-text">설정</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;
