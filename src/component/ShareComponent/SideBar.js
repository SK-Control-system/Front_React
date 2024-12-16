import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
  const { userName } = useUser(); // Google 사용자 이름 가져오기
  const location = useLocation(); // 현재 경로 가져오기

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
            to="/analytics" 
            aria-label="실시간 내 방송" 
            className={location.pathname === "/analytics" ? "active" : ""}
          >
            <FaFileAlt className="menu-icon" />
            <span className="menu-text">실시간 내 방송</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/channel" 
            aria-label="채널 통계" 
            className={location.pathname === "/channel" ? "active" : ""}
          >
            <FaChartBar className="menu-icon" />
            <span className="menu-text">채널 통계</span>
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