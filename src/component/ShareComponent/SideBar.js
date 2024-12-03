import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaFileAlt, FaChartBar, FaUsers, FaClosedCaptioning, FaCopyright, FaCog } from "react-icons/fa";
import "./SideBar.css";

const SideBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <h2 className="channel-name">루키즈1조</h2>
      <ul className="menu">
        <li>
          <Link to="/dashboard">
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
          <Link to="/analytics">
            <FaChartBar />
            <span className="menu-text">분석</span>
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
