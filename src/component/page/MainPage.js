import React from "react";
import StatisticsPanel from "../main/StatisticsPanel";
import LiveViewerChart from "../main/LiveViewerChart";
import ViewerCategoryStats from "../main/ViewerCategoryStats";
import BroadcastRanking from "../main/BroadcastRanking";
import "../../App.css";

function MainPage({ viewerData }) {
  return (
    <div className="main-container">
      <StatisticsPanel />
      <LiveViewerChart viewerData={viewerData} />
      <ViewerCategoryStats />
      <BroadcastRanking />
    </div>
  );
}

export default MainPage;
