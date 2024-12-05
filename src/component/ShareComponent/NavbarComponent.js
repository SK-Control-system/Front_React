import { useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from "react-router-dom";
import { useUser } from '../../provider/UserContext';
import "./NavbarComponent.css"

function NavbarComponent() {
  const { userId, setUserId } = useUser();

  useEffect(() => {
    // 스크립트 로드 완료 확인을 위한 함수
    const initializeGoogleSignIn = () => {
      if (window.google) {
        try {
          window.google.accounts.id.initialize({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse
          });
        } catch (error) {
          console.error('Google Sign-In 초기화 오류:', error);
        }
      }
    };

    // 스크립트 로드 상태 확인
    if (document.readyState === 'complete') {
      initializeGoogleSignIn();
    } else {
      window.addEventListener('load', initializeGoogleSignIn);
      return () => window.removeEventListener('load', initializeGoogleSignIn);
    }
  }, []);

  const handleCredentialResponse = async (response) => {
    try {
      // 백엔드 API 호출
      const res = await fetch(`https://${process.env.REACT_APP_BACKEND_POD_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${response.credential}`,
        },
      });
      const data = await res.json();

      localStorage.setItem('userId', data.body.userId);
      setUserId(data.body.userId);
    } catch (error) {
      console.error('로그인 중 오류 발생:', error);
    }
  };

  const handleGoogleLogin = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setUserId(null);
  };

  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">라온</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/analytics">실시간 방송통계</Nav.Link>
          <Nav.Link as={Link} to="/livebroadcast">라이브 방송목록</Nav.Link>
          <Nav.Link as={Link} to="/channel">채널 통계</Nav.Link>
        </Nav>
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
  );
}

export default NavbarComponent;
