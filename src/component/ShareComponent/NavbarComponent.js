import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from "react-router-dom";
import Subscription from './Subscription';
import { useUser } from '../../provider/UserContext';
import "./NavbarComponent.css";

function NavbarComponent() {
  const { userId, setUserId } = useUser();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const handleGoogleLogin = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setUserId(null);
  };

  const toggleSubscriptionModal = () => {
    setShowSubscriptionModal(!showSubscriptionModal);
  };

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand as={Link} to="/">라온</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/analytics">실시간 방송통계</Nav.Link>
            <Nav.Link as={Link} to="/livebroadcast">라이브 방송목록</Nav.Link>
            <Nav.Link as={Link} to="/channel">채널 통계</Nav.Link>
          </Nav>
          <div className="sub-buttons">
            <button className="sub-btn" onClick={toggleSubscriptionModal}>
              구독 추가
            </button>
          </div>
          <div className="auth-buttons">
            {userId ? (
              <button className="auth-btn logout-btn" onClick={handleLogout}>
                로그아웃
              </button>
            ) : (
              <button className="auth-btn login-btn" onClick={handleGoogleLogin}>
                로그인
              </button>
            )}
          </div>
        </Container>
      </Navbar>

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <Subscription show={showSubscriptionModal} onHide={toggleSubscriptionModal} />
      )}
    </>
  );
}

export default NavbarComponent;
