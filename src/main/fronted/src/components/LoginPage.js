// src/components/LoginPage.js

import React, { useState } from 'react';
import { Eye, EyeOff, LogIn } from 'lucide-react';

const LoginPage = () => {
    // 상태 관리
    const [formData, setFormData] = useState({
        userName: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // 입력 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // 에러 메시지 초기화
        if (error) setError('');
    };

    // 로그인 처리
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 유효성 검사
        if (!formData.userName || !formData.password) {
            setError('아이디와 비밀번호를 모두 입력해주세요');
            return;
        }

        setIsLoading(true);

        try {
            // API 호출
            const response = await fetch('/api/members/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userName: formData.userName,
                    password: formData.password
                })
            });

            if (response.ok) {
                const userData = await response.json();

                // 로그인 성공
                // 사용자 정보를 localStorage에 저장
                localStorage.setItem('user', JSON.stringify(userData));

                // 홈 페이지로 이동
                window.location.href = '/';
            } else {
                setError('아이디 또는 비밀번호가 올바르지 않습니다');
            }
        } catch (error) {
            console.error('Login error:', error);

            // 개발 중 테스트용 - API 연결 안됐을 때
            if (formData.userName === 'test' && formData.password === 'test123') {
                const demoUser = {
                    id: 1,
                    userName: formData.userName,
                    displayName: '테스트유저',
                    createdAt: new Date().toISOString()
                };
                localStorage.setItem('user', JSON.stringify(demoUser));
                alert('(데모) 로그인 성공!');
                window.location.href = '/';
            } else {
                setError('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.loginBox}>
                {/* 로고/타이틀 */}
                <div style={styles.header}>
                    <div style={styles.logoCircle}>
                        <LogIn size={32} color="white" />
                    </div>
                    <h1 style={styles.title}>Social Hub</h1>
                    <p style={styles.subtitle}>로그인하여 시작하세요</p>
                </div>

                {/* 에러 메시지 */}
                {error && (
                    <div style={styles.errorBox}>
                        {error}
                    </div>
                )}

                {/* 로그인 폼 */}
                <form onSubmit={handleSubmit}>
                    {/* 아이디 입력 */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>아이디</label>
                        <input
                            type="text"
                            name="userName"
                            value={formData.userName}
                            onChange={handleChange}
                            placeholder="아이디를 입력하세요"
                            style={styles.input}
                            disabled={isLoading}
                        />
                    </div>

                    {/* 비밀번호 입력 */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>비밀번호</label>
                        <div style={styles.passwordWrapper}>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="비밀번호를 입력하세요"
                                style={styles.input}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={styles.eyeButton}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* 로그인 버튼 */}
                    <button
                        type="submit"
                        style={{
                            ...styles.loginButton,
                            ...(isLoading ? styles.loginButtonDisabled : {})
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? '로그인 중...' : '로그인'}
                    </button>
                </form>

                {/* 회원가입 링크 */}
                <div style={styles.footer}>
                    <span>아직 계정이 없으신가요? </span>
                    <a href="/signup" style={styles.signupLink}>
                        회원가입
                    </a>
                </div>

                {/* 테스트 안내 */}
                <div style={styles.testInfo}>
                    <small>테스트 계정: test / test123</small>
                </div>
            </div>
        </div>
    );
};

// 스타일
const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px'
    },
    loginBox: {
        width: '100%',
        maxWidth: '400px',
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
    },
    header: {
        textAlign: 'center',
        marginBottom: '30px'
    },
    logoCircle: {
        width: '80px',
        height: '80px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px'
    },
    title: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#333',
        margin: '0 0 10px 0'
    },
    subtitle: {
        fontSize: '14px',
        color: '#666',
        margin: 0
    },
    errorBox: {
        background: '#fee',
        color: '#c00',
        padding: '10px',
        borderRadius: '8px',
        fontSize: '14px',
        marginBottom: '20px',
        textAlign: 'center'
    },
    inputGroup: {
        marginBottom: '20px'
    },
    label: {
        display: 'block',
        fontSize: '14px',
        fontWeight: '600',
        color: '#333',
        marginBottom: '8px'
    },
    input: {
        width: '100%',
        padding: '12px',
        fontSize: '16px',
        border: '2px solid #e0e0e0',
        borderRadius: '10px',
        outline: 'none',
        transition: 'border-color 0.3s',
        boxSizing: 'border-box'
    },
    passwordWrapper: {
        position: 'relative'
    },
    eyeButton: {
        position: 'absolute',
        right: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '5px',
        color: '#666'
    },
    loginButton: {
        width: '100%',
        padding: '14px',
        fontSize: '16px',
        fontWeight: 'bold',
        color: 'white',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        marginTop: '10px'
    },
    loginButtonDisabled: {
        opacity: 0.6,
        cursor: 'not-allowed'
    },
    footer: {
        textAlign: 'center',
        marginTop: '30px',
        fontSize: '14px',
        color: '#666'
    },
    signupLink: {
        color: '#667eea',
        textDecoration: 'none',
        fontWeight: 'bold'
    },
    testInfo: {
        textAlign: 'center',
        marginTop: '20px',
        padding: '10px',
        background: '#f5f5f5',
        borderRadius: '8px',
        color: '#888'
    }
};

export default LoginPage;