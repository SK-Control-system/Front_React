import React, { useState } from "react";
import { Link, useLocation ,useNavigate} from "react-router-dom";
import axios from "axios";
import { 
  FaHome, 
  FaFileAlt, 
  FaChartBar, 
  FaUsers, 
  FaClosedCaptioning, 
  FaCopyright, 
  FaCog 
} from "react-icons/fa";
import "./SideBar.css";
import { useUser } from "../../provider/UserContext";

const SideBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { userName, userChannelId } = useUser(); // Google 사용자 이름과 채널 ID 가져오기
  const location = useLocation(); // 현재 경로 가져오기
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
      <h2 className="channel-name">{userName || "로그인 필요"}</h2> {/* 사용자 이름 표시 */}
      <ul className="menu">
        <li>
          <Link 
            to="/" 
            aria-label="홈" 
            className={location.pathname === "/" ? "active" : ""}
          >
            <FaHome className="menu-icon" />
            <span className="menu-text">홈</span>
          </Link>
        </li>
        <li>
          <Link 
            to='#'
            aria-label="실시간 내 방송" 
            className={location.pathname === "/analytics" ? "active" : ""}
            onClick={handleAnalyticsClick} // 클릭 이벤트 연결
          >
            <FaFileAlt className="menu-icon" />
            <span className="menu-text">실시간 내 방송</span>
          </Link>
        </li>
        <li>
          <Link 
            to={`/channel/${userChannelId || "default"}`} 
            aria-label="내 채널 보기" 
            className={location.pathname === `/channel/${userChannelId}` ? "active" : ""}
          >
            <FaChartBar className="menu-icon" />
            <span className="menu-text">내 채널 보기</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/community" 
            aria-label="커뮤니티" 
            className={location.pathname === "/community" ? "active" : ""}
          >
            <FaUsers className="menu-icon" />
            <span className="menu-text">커뮤니티</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/subtitles" 
            aria-label="자막" 
            className={location.pathname === "/subtitles" ? "active" : ""}
          >
            <FaClosedCaptioning className="menu-icon" />
            <span className="menu-text">자막</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/copyright" 
            aria-label="저작권" 
            className={location.pathname === "/copyright" ? "active" : ""}
          >
            <FaCopyright className="menu-icon" />
            <span className="menu-text">저작권</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/settings" 
            aria-label="설정" 
            className={location.pathname === "/settings" ? "active" : ""}
          >
            <FaCog className="menu-icon" />
            <span className="menu-text">설정</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;
