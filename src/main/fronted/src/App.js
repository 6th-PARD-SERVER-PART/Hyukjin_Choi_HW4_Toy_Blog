// src/App.js

import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import HomePage from './components/HomePage';
import './App.css';

function App() {
    const [currentPage, setCurrentPage] = useState('login');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // 컴포넌트 마운트시 실행
    useEffect(() => {
        // 로그인 상태 확인
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (user && token) {
            setIsAuthenticated(true);
            setCurrentPage('home');
        } else {
            // URL 경로에 따라 페이지 설정
            const path = window.location.pathname;
            if (path === '/signup') {
                setCurrentPage('signup');
            } else if (path === '/home' || path === '/') {
                // 로그인 안되어 있으면 로그인 페이지로
                if (!user) {
                    setCurrentPage('login');
                } else {
                    setCurrentPage('home');
                }
            } else {
                setCurrentPage('login');
            }
        }

        // 브라우저 뒤로가기/앞으로가기 처리
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    // 브라우저 히스토리 변경 처리
    const handlePopState = () => {
        const path = window.location.pathname;
        const user = localStorage.getItem('user');

        if (path === '/signup') {
            setCurrentPage('signup');
        } else if (path === '/home') {
            if (user) {
                setCurrentPage('home');
            } else {
                navigateTo('login');
            }
        } else if (path === '/login' || path === '/') {
            setCurrentPage('login');
        }
    };

    // 페이지 전환 함수
    const navigateTo = (page) => {
        setCurrentPage(page);

        // URL 변경
        if (page === 'login') {
            window.history.pushState({}, '', '/login');
        } else if (page === 'signup') {
            window.history.pushState({}, '', '/signup');
        } else if (page === 'home') {
            window.history.pushState({}, '', '/home');
        }
    };

    // 로그인 성공 처리
    const handleLoginSuccess = (userData) => {
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
        // token이 있다면 저장
        if (userData.token) {
            localStorage.setItem('token', userData.token);
        }
        navigateTo('home');
    };

    // 회원가입 성공 처리
    const handleSignupSuccess = () => {
        navigateTo('login');
    };

    // 로그아웃 처리
    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigateTo('login');
    };

    // 페이지별 렌더링
    const renderPage = () => {
        switch(currentPage) {
            case 'login':
                return (
                    <LoginPage
                        onLoginSuccess={handleLoginSuccess}
                        onSignupClick={() => navigateTo('signup')}
                    />
                );
            case 'signup':
                return (
                    <SignupPage
                        onSignupSuccess={handleSignupSuccess}
                        onLoginClick={() => navigateTo('login')}
                    />
                );
            case 'home':
                return (
                    <HomePage
                        onLogout={handleLogout}
                    />
                );
            default:
                return (
                    <LoginPage
                        onLoginSuccess={handleLoginSuccess}
                        onSignupClick={() => navigateTo('signup')}
                    />
                );
        }
    };

    return (
        <div className="App">
            {renderPage()}
        </div>
    );
}

export default App;