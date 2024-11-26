import React, { useState } from "react";
import "./Tabs.css"; // 위에서 정의한 CSS를 여기에 작성
import ViewerReactionChart from "./ViewerReactionChart"; // ViewerReactionChart 컴포넌트를 가져옴

// 탭에 따라 보여줄 컴포넌트들
const ViewerReaction = () => {
  const mockData = {
    veryPositive: 30,
    positive: 50,
    neutral: 20,
    negative: 15,
    veryNegative: 10,
  }; // 더미 데이터

  return <ViewerReactionChart data={mockData} />;
};
// 탭에 따라 보여줄 컴포넌트들
// const ViewerReaction = () => <div>시청자 반응 내용</div>;
const KeywordStats = () => <div>키워드 내용</div>;
const LikesAndComments = () => <div>좋아요 & 댓글 내용</div>;

const Tabs = () => {
  // 활성화된 탭 상태 관리
  const [activeTab, setActiveTab] = useState("viewerReaction");

  // 탭 내용 렌더링
  const renderContent = () => {
    switch (activeTab) {
      case "viewerReaction":
        return <ViewerReaction />;
      case "keywordStats":
        return <KeywordStats />;
      case "likesAndComments":
        return <LikesAndComments />;
      default:
        return null;
    }
  };

  return (
    <div className="binance-tabs">
      {/* 탭 버튼 */}
      <div className="tab-buttons">
        <div
          className={`tab ${activeTab === "viewerReaction" ? "active" : ""}`}
          onClick={() => setActiveTab("viewerReaction")}
        >
          시청자 반응
        </div>
        <div
          className={`tab ${activeTab === "keywordStats" ? "active" : ""}`}
          onClick={() => setActiveTab("keywordStats")}
        >
          키워드
        </div>
        <div
          className={`tab ${activeTab === "likesAndComments" ? "active" : ""}`}
          onClick={() => setActiveTab("likesAndComments")}
        >
          좋아요 & 댓글
        </div>
      </div>

      {/* 탭 내용 */}
      <div className="tab-content">{renderContent()}</div>
    </div>
  );
};

export default Tabs;
