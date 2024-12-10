import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from "react-router-dom";
import { useUser } from '../../provider/UserContext';
import "./NavbarComponent.css"

function NavbarComponent() {
  const { userId, setUserId } = useUser();

  const handleGoogleLogin = async () => {
    sessionStorage.setItem('loginRedirectUrl', window.location.pathname + window.location.search);
    console.log(sessionStorage.getItem('loginRedirectUrl'));
    window.location.href = `${process.env.REACT_APP_BACKEND_POD_URL}/oauth2/authorization/google`;
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
