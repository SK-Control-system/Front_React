import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import './Subscription.css';
import { useUser } from '../../provider/UserContext';

function Subscription({ show, onHide }) {
  const [channelId, setChannelId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { userId, token } = useUser();

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search`,
        {
          params: {
            part: 'snippet',
            q: searchQuery,
            type: 'channel',
            maxResults: 10,
            key: process.env.REACT_APP_YOUTUBE_API_KEY
          }
        }
      );
      setSearchResults(response.data.items);
    } catch (error) {
      console.error('채널 검색 중 오류 발생:', error);
    }
    setIsLoading(false);
  };

  const handleChannelSelect = (channel) => {
    setChannelId(channel.id.channelId);
    setSearchResults([]); // 검색 결과 초기화
  };

  const handleSubscription = async () => {
    const token = sessionStorage.getItem("token"); // Google OAuth2.0 액세스 토큰
    const userId = sessionStorage.getItem("userId"); // 유저 ID
  
    try {
      console.log("토큰@@@@@", token);
      console.log("@@@@@@@@", channelId, userId);
  
      if (!token || !userId) {
        alert("유효한 토큰 또는 유저 정보가 없습니다.");
        return;
      }
  
      await axios.post(
        `${process.env.REACT_APP_API_POD_URL}/subscription/register?channelId=${channelId}&userId=${userId}`,
        {}, // 요청 body가 비어있다면 빈 객체 전달
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` // 액세스 토큰을 Authorization 헤더에 추가
          }
        }
      );
  
      alert("구독이 추가되었습니다!");
    } catch (error) {
      console.error("구독 요청 중 오류 발생:", error);
      alert("구독 요청에 실패했습니다.");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>구독 추가</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="mb-4">
          <Form.Group controlId="channelIdInput">
            <Form.Control
              type="text"
              placeholder="구독할 유튜브 채널 ID를 입력하세요"
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
            />
          </Form.Group>
        </Form>

        <hr />

        <Form onSubmit={handleSearch} className="mb-3">
          <Form.Group className="search-form-group">
            <Form.Control
              type="text"
              placeholder="채널명으로 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" variant="secondary">
              검색
            </Button>
          </Form.Group>
        </Form>

        {isLoading && <div className="text-center my-3">검색 중...</div>}

        <div className="search-results">
          {searchResults.map((channel) => (
            <div
              key={channel.id.channelId}
              className="channel-item"
              onClick={() => handleChannelSelect(channel)}
            >
              <img
                src={channel.snippet.thumbnails.default.url}
                alt={channel.snippet.title}
                className="channel-thumbnail"
              />
              <div className="channel-info">
                <h5 className="mb-1">{channel.snippet.title}</h5>
                <p className="mb-0 text-muted">{channel.snippet.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          닫기
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            if (channelId) {
              handleSubscription();
              onHide();
            } else {
              alert('채널 ID를 입력하거나 선택해주세요.');
            }
          }}
        >
          추가
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Subscription;
