import React from "react";
import "./LiveBroadcastPage.css";

const BroadcastCard = ({ title, channel, views, category, thumbnail, profile, starttime}) => {
  return (
    <div className="live-broadcast-card">
      <div
        className="live-broadcast-card-media"
        style={{ backgroundImage: `url(${thumbnail})` }}
      ></div>
      <div className="live-broadcast-card-info">
        <div className="live-broadcast-card-name">
          <div className="live-broadcast-channel-group">
            <div className="live-broadcast-youtube-logo">
              <div className="youtube-red-background">
                <div className="youtube-white-play"></div>
              </div>
            </div>
            <span className="live-broadcast-channel-name">{channel}</span>
          </div>
          <span className="live-broadcast-category">{category}</span>
        </div>
        <div className="live-broadcast-card-content">
          <img
            className="live-broadcast-channel-profile"
            src={profile}
            alt={`${channel} profile`}
          />
          <span className="live-broadcast-card-title">{title}</span>
        </div>
        <div className="live-broadcast-card-footer">
          <span className="live-broadcast-view-count">{views} 명 시청중</span>
          <span className="live-broadcast-start-time"> {starttime} 시작</span>
        </div>
      </div>
    </div>
  );
};

const LiveBroadcastPage = () => {
  const data = {
    categories: [
      {
        name: "내 구독 목록",
        broadcasts: [
          {
            title: "방송 제목 1",
            channel: "채널 1",
            views: "10,000",
            category: "게임",
            thumbnail: "https://dimg.donga.com/wps/NEWS/IMAGE/2015/09/10/73552739.2.jpg",
            profile: "https://yt3.ggpht.com/ytc/AIdro_kFqbmXOoxJIaLVQYrJMB8gR8_LTF7Wm1lDpZbCmqhJh3U=s88-c-k-c0x00ffffff-no-rj",
            starttime:"09:17"
          },
          {
            title: "방송 제목 2",
            channel: "채널 2",
            views: "5,000",
            category: "음악",
            thumbnail: "/path/to/image2.jpg",
            profile: "https://yt3.ggpht.com/ytc/ANd9GcT_FakeProfile=s88-c-k-c0x00ffffff-no-rj",
            starttime:"09:24"
          },
          
        ],
      },
      {
        name: "리그 오브 레전드",
        broadcasts: [
          {
            title: "롤 경기 1",
            channel: "롤 채널",
            views: "8,000",
            category: "리그 오브 레전드",
            thumbnail: "/path/to/image3.jpg",
            profile: "https://yt3.ggpht.com/ytc/ANd9GcT_RiotGames=s88-c-k-c0x00ffffff-no-rj",
            starttime:"09:34"
          },
        ],
      },
    ],
  };
  return (
    <div className="live-broadcast-page">
      {data.categories.map((category, index) => (
        <div key={index} className="live-broadcast-category-section">
          <h2 className="live-broadcast-category-title">{category.name}</h2>
          <div className="live-broadcast-list">
            {category.broadcasts.map((broadcast, idx) => (
              <BroadcastCard key={idx} {...broadcast} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LiveBroadcastPage;
