import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavbarComponent from "./component/ShareComponent/NavbarComponent";
import SideBar from "./component/ShareComponent/SideBar"
import MainPage from "./component/page/MainPage";
import AnalyticsPage from "./component/page/AnalyticsPage";
import ChannelAnalyticsPage from "./component/channel/ChannelAnalyticsPage";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import LiveBroadcastPage from "./component/page/LiveBroadcastPage";
import { WebSocketProvider } from "./provider/websocketContext";
import { UserProvider } from "./provider/UserContext";
function App() {
  const stats = {
    totalViewers: 72131,
    avgViewers: 36111,
    totalLikes: 15552,
    totalComments: 23184,
  };

  const viewerData = [
    { time: "15:00", viewers: 10 },
    { time: "18:00", viewers: 25 },
    { time: "21:00", viewers: 40 },
    { time: "00:00", viewers: 61 },
    { time: "03:00", viewers: 55 },
    { time: "06:00", viewers: 45 },
    { time: "09:00", viewers: 70 },
    { time: "12:00", viewers: 30 },
  ];

  const categories = [
    { name: "리그 오브 레전드", percentage: 45, color: "#456CFF" },
    { name: "음악", percentage: 20, color: "#43FF8C" },
    { name: "정치", percentage: 18, color: "#FF43E3" },
    { name: "버추얼", percentage: 17, color: "#FFA344" },
  ];

  const rankings = [
    {
      name: "봉준",
      profileImage: "https://yt3.ggpht.com/0A00TuicuSqhF8lYQKnE7MxzCrsmEpLbVG2b8KeBo591PzbEHwpzIaTG4kX6yJcNT6EfGXi1kWg=s88-c-k-c0x00ffffff-no-rj",
      title: "교장서버 마크",
      viewers: 44708,
      category: "마인크래프트",
      color: "#B3B6FF",
    },
    {
      name: "김성태",
      profileImage: "https://yt3.ggpht.com/ytc/AIdro_kblg45EIsy8otvQCXIc1a6Y8JqNjAS3i8NcmXD-2E-TXw=s88-c-k-c0x00ffffff-no-rj",
      title: "마인크래프트 김성태",
      viewers: 35128,
      category: "음악",
      color: "#FFFACD",
    },
    {
      name: "우왁굳",
      profileImage: "https://yt3.ggpht.com/vhOEy7Ode6Y8ZN3noHKZua0LMt2n2Z7xfEyfWmzTXwQ6oq59BFyTXnN9AcnksHTYAM1YCzdY=s88-c-k-c0x00ffffff-no-rj",
      title: "토크/겜방",
      viewers: 15321,
      category: "게임",
      color: "#FFC0CB",
    },
  ];

  const handleGoogleLogin = async () => {
    try {
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

      sessionStorage.setItem('userId', data.body.userId);
    } catch (error) {
      console.error('로그인 중 오류 발생:', error)
    }
  };

  return (
    <UserProvider>
      <WebSocketProvider>
        <Router>
          <NavbarComponent />
          <SideBar />
          <Routes>
            <Route
              path="/"
              element={<MainPage stats={stats} viewerData={viewerData} categories={categories} rankings={rankings} />}
            />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route
              path="/livebroadcast"
              element={<LiveBroadcastPage categories={categories} rankings={rankings} />}
            />
            {/* <Route path="/channel" element={<ChannelAnalyticsPage />} /> */}
            <Route path="/channel/:videoId" element={<ChannelAnalyticsPage />} />

          </Routes>
        </Router>
      </WebSocketProvider>
    </UserProvider>
  );
}

export default App;
