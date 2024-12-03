import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from "react-router-dom";
function NavbarComponent() {
  return (
    <Navbar bg="dark" data-bs-theme="dark">
        <Container>
        <Navbar.Brand as={Link} to="/">
          라온
        </Navbar.Brand>
          <Nav className="me-auto">
          <Nav.Link as={Link} to="/analytics">실시간 방송통계</Nav.Link>
          <Nav.Link as={Link} to="/livebroadcast">라이브 방송목록</Nav.Link>
          <Nav.Link as={Link} to="/channel">채널 통계</Nav.Link>

          </Nav>
        </Container>
      </Navbar>
  );
}

export default NavbarComponent;
