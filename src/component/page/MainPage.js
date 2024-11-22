import React from "react";
import StatisticsPanel from "../main/StatisticsPanel";
import LiveViewerChart from "../main/LiveViewerChart";
import ViewerCategoryStats from "../main/ViewerCategoryStats";
import BroadcastRanking from "../main/BroadcastRanking";
import "../../App.css";

function MainPage({ stats, viewerData, categories, rankings }) {
  return (
    <div className="main-container">
      <StatisticsPanel stats={stats} />
      <LiveViewerChart data={viewerData} />
      <ViewerCategoryStats categories={categories} />
      <BroadcastRanking rankings={rankings} />
    </div>
  );
}

export default MainPage;
