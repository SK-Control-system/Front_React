import React from "react";
import "./StatisticsPanel.css";

function StatisticsPanel({ stats }) {
  return (
    <div className="statistics-panel">
      <div className="card card1">
        <div className="card-header">전체 시청자 수</div>
        <div className="card-row">
          <div className="card-content">
            {stats.totalViewers.toLocaleString()} 명
          </div>
          <div className="card-percentage positive">
            +11.01% <span className="arrow">⬆</span>
          </div>
        </div>
      </div>
      <div className="card card2">
        <div className="card-header">평균 시청자 수</div>
        <div className="card-row">
          <div className="card-content">
            {stats.avgViewers.toLocaleString()} 명
          </div>
          <div className="card-percentage negative">
            -0.03% <span className="arrow">⬇</span>
          </div>
        </div>
      </div>
      <div className="card card1">
        <div className="card-header">전체 좋아요 수</div>
        <div className="card-row">
          <div className="card-content">
            {stats.totalLikes.toLocaleString()} 개
          </div>
          <div className="card-percentage positive">
            +15.03% <span className="arrow">⬆</span>
          </div>
        </div>
      </div>
      <div className="card card2">
        <div className="card-header">전체 댓글 수</div>
        <div className="card-row">
          <div className="card-content">
            {stats.totalComments.toLocaleString()} 개
          </div>
          <div className="card-percentage positive">
            +6.08% <span className="arrow">⬆</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatisticsPanel;
