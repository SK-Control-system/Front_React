import React from "react";
import "./BroadcastRanking.css";

function BroadcastRanking({ rankings }) {
  return (
    <div className="broadcast-ranking">
      <div className="ranking-header">
        <h2>방송 랭킹</h2>
        <div className="ranking-controls">
          <input
            type="text"
            className="search-input"
            placeholder="Search for anything..."
          />
          <button className="search-button">
            <i className="fas fa-search"></i>
          </button>
          <div className="date-filter">
            <span>10 May - 20 May</span>
            <i className="fas fa-caret-down"></i>
          </div>
        </div>
      </div>
      <table className="ranking-table">
        <thead>
          <tr>
            <th>순위</th>
            <th>이름</th>
            <th>제목</th>
            <th>시청자 수</th>
            <th>분류</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((rank, index) => (
            <tr key={index}>
              <td className="rank-column">#{index + 1}</td>
              <td>
                <div className="profile">
                  <span
                    className="profile-circle"
                    style={{ 
                      backgroundImage: `url(${rank.profileImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></span>
                  {rank.name}
                </div>
              </td>
              <td>{rank.title}</td>
              <td>{rank.viewers.toLocaleString()}명</td>
              <td>
                <span className="category-badge">{rank.category}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BroadcastRanking;
