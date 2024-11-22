import React from "react";
import "./ViewerCategoryStats.css";

function ViewerCategoryStats({ categories }) {
  return (
    <div className="viewer-category-stats">
      <div className="header">
        <span>시청자 점유율</span>
        <span>카테고리</span>
        <span>점유율</span>
        <span>백분위</span>
      </div>
      {categories.map((category, index) => (
        <div key={index} className="category-row">
          <div className="rank">{`#0${index + 1}`}</div>
          <div className="category-name">{category.name}</div>
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${category.percentage}%`, backgroundColor: category.color }}
            ></div>
          </div>
          <div className="percentage">{`${category.percentage}%`}</div>
        </div>
      ))}
    </div>
  );
}

export default ViewerCategoryStats;
