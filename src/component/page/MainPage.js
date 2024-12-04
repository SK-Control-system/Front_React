import React, { useState } from "react";
import StatisticsPanel from "../main/StatisticsPanel";
import LiveViewerChart from "../main/LiveViewerChart";
import ViewerCategoryStats from "../main/ViewerCategoryStats";
import BroadcastRanking from "../main/BroadcastRanking";
import "../../App.css";

function MainPage({ stats, viewerData, categories, rankings }) {
  const [userId, setUserId] = useState(null);

  const handleGoogleLogin = async () => {
    // Google 로그인 요청
    const auth2 = window.gapi.auth2.getAuthInstance();
    const googleUser = await auth2.signIn();
    const idToken = googleUser.getAuthResponse().id_token;

    // 백엔드 API 호출
    const response = await fetch(`https://${process.env.REACT_APP_BACKEND_POD_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    });
    const data = await response.json();

    // userId 설정
    setUserId(data.userId);
  };

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
