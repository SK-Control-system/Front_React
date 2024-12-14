import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavbarComponent from "./component/ShareComponent/NavbarComponent";
import SideBar from "./component/ShareComponent/SideBar"
import MainPage from "./component/page/MainPage";
import AnalyticsPage from "./component/page/AnalyticsPage";
import ChannelAnalyticsPage from "./component/channel/ChannelAnalyticsPage";
import "bootstrap/dist/css/bootstrap.min.css";
import { WebSocketProvider } from "./provider/WebSocketContext";
import "./App.css";
import axios from "axios";
import LiveBroadcastPage from "./component/page/LiveBroadcastPage";
import OAuth2RedirectHandler from "./redirection/OAuth2RedirectHandler";
import NotificationPopup from "./provider/NotificationPopup";
import KjhChannelPage from "./component/channel/kjhChannelPage";

function App() {
  const [viewerData, setViewerData] = useState([]);

  useEffect(() => {
    const fetchViewerData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_POD_URL}/api/redis/get/hash/videoId`);

        const rawData = Object.values(response.data)
          .map((item) => JSON.parse(item))
          .filter((video) => video.concurrentViewers);

        const totalViewers = rawData.reduce(
          (sum, video) => sum + parseInt(video.concurrentViewers, 10),
          0
        );

        const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        setViewerData((prevData) => [...prevData, { time: currentTime, viewers: totalViewers }]);
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
      }
    };

    fetchViewerData();
    const interval = setInterval(fetchViewerData, 60000); // 1분마다 호출

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 해제
  }, []);

  return (
    <WebSocketProvider>
      <div>
        <NotificationPopup/>
        <Router>
          <NavbarComponent />
          <SideBar />
          <Routes>
            <Route
              path="/"
              element={<MainPage viewerData={viewerData} />}
            />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/analytics/:currentDate/:videoId" element={<AnalyticsPage />} />
            <Route
              path="/livebroadcast"
              element={<LiveBroadcastPage viewerData={viewerData} />}
            />
            <Route path="/channel/:videoId" element={<ChannelAnalyticsPage />} />
            <Route path="/oauth/callback/google" element={<OAuth2RedirectHandler />} />

            {/* 김재형 채널 통계 */}
            <Route path="/kjhTest" element={<KjhChannelPage />} />
          </Routes>
        </Router>
      </div>
    </WebSocketProvider>
  );
}


export default App;
