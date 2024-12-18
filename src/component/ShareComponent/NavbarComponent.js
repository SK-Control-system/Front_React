import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from "react-router-dom";
import Subscription from './Subscription';
import { useUser } from '../../provider/UserContext';
import "./NavbarComponent.css";
import logo from '../../static/Live On Your YouTube.svg'; 

function NavbarComponent() {
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const { userId, setUserId, userChannelId, setUserChannelId, token, setToken, userName, setUserName} = useUser();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const userId = params.get("userId");
        const userName = decodeURIComponent(params.get("userName")); // URL 디코딩
        const token = params.get("accessToken");
        const userChannelId = params.get("userChannelId");

        if (userId && userName && token) { // 모든 값이 있을 때만 실행
            setUserId(userId);
            setUserName(userName);
            setToken(token);
            setUserChannelId(userChannelId);

            sessionStorage.setItem("userId", userId);
            sessionStorage.setItem("userName", userName);
            sessionStorage.setItem("token", token);
            sessionStorage.setItem("userChannelId", userChannelId);

        }
    }, [setUserId, setUserName, setToken, setUserChannelId]);

    const handleGoogleLogin = async () => {
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("userName");
        sessionStorage.removeItem("token");

        sessionStorage.setItem('loginRedirectUrl', window.location.pathname + window.location.search);
        console.log(sessionStorage.getItem('loginRedirectUrl'));
        window.location.href = `${process.env.REACT_APP_API_POD_URL}/googleLogin`;
        console.log(`로그인버튼작동 , '${process.env.REACT_APP_API_POD_URL}'`);

    };

    const handleLogout = () => {
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("userName");
        sessionStorage.removeItem("token");

        setUserId(null);
        setUserName(null);
        setToken(null);
    };

    const toggleSubscriptionModal = () => {
        setShowSubscriptionModal(!showSubscriptionModal);
    };

    return (
        <>
            <Navbar bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand as={Link} to="/"><img
                        src={logo}
                        alt="라온"
                        className="h-11 w-auto"
                        /></Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/livebroadcast">라이브 방송목록</Nav.Link>
                        <Nav.Link as={Link} to="/channel">채널 통계</Nav.Link>
                    </Nav>

                    <div className="auth-buttons">
                        {userId ? (
                            <div className="sub-buttons">
                                <button className="auth-btn logout-btn" onClick={handleLogout}>
                                    로그아웃
                                </button>
                            </div>
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
