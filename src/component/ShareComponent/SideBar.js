import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaFileAlt, FaChartBar, FaUsers, FaClosedCaptioning, FaCopyright, FaCog } from "react-icons/fa";
import "./SideBar.css";
import { useUser } from "../../provider/UserContext";

const SideBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { userName } = useUser(); // Google 사용자 이름 가져오기

  return (
    <div
      className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
       <h2 className="channel-name">{userName || "로그인 필요"}</h2> {/* 사용자 이름 표시 */}
      <ul className="menu">
        <li>
          <Link to="/">
            <FaHome />
            <span className="menu-text">홈</span>
          </Link>
        </li>
        <li>
          <Link to="/analytics">
            <FaFileAlt />
            <span className="menu-text">실시간 내 방송</span>
          </Link>
        </li>
        <li>
          <Link to="/channel">
            <FaChartBar />
            <span className="menu-text">채널 통계</span>
          </Link>
        </li>
        <li>
          <Link to="/community">
            <FaUsers />
            <span className="menu-text">커뮤니티</span>
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
