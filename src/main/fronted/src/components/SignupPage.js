// src/components/SignupPage.js

import React, { useState } from 'react';
import { UserPlus, Eye, EyeOff, Check, X } from 'lucide-react';

const SignupPage = () => {
    // 상태 관리
    const [formData, setFormData] = useState({
        userName: '',
        displayName: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // 입력 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // 해당 필드 에러 메시지 초기화
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // 유효성 검사
    const validateForm = () => {
        const newErrors = {};

        // 아이디 검사
        if (!formData.userName) {
            newErrors.userName = '아이디를 입력해주세요';
        } else if (formData.userName.length < 4) {
            newErrors.userName = '아이디는 4자 이상이어야 합니다';
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.userName)) {
            newErrors.userName = '아이디는 영문, 숫자, 언더바만 사용 가능합니다';
        }

        // 닉네임 검사
        if (!formData.displayName) {
            newErrors.displayName = '닉네임을 입력해주세요';
        } else if (formData.displayName.length < 2) {
            newErrors.displayName = '닉네임은 2자 이상이어야 합니다';
        }

        // 비밀번호 검사
        if (!formData.password) {
            newErrors.password = '비밀번호를 입력해주세요';
        } else if (formData.password.length < 6) {
            newErrors.password = '비밀번호는 6자 이상이어야 합니다';
        }

        // 비밀번호 확인 검사
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = '비밀번호 확인을 입력해주세요';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
        }

        return newErrors;
    };

    // 회원가입 처리
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 유효성 검사
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        setErrors({});
        setSuccessMessage('');

        try {
            // API 호출
            const response = await fetch('/api/members', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userName: formData.userName,
                    displayName: formData.displayName,
                    password: formData.password
                })
            });

            if (response.ok) {
                // 회원가입 성공
                setSuccessMessage('회원가입이 완료되었습니다!');
                setFormData({
                    userName: '',
                    displayName: '',
                    password: '',
                    confirmPassword: ''
                });

                // 2초 후 로그인 페이지로 이동
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else if (response.status === 409) {
                setErrors({ userName: '이미 사용중인 아이디입니다' });
            } else {
                setErrors({ general: '회원가입에 실패했습니다. 다시 시도해주세요.' });
            }
        } catch (error) {
            console.error('Signup error:', error);

            // 개발 중 테스트용 - API 연결 안됐을 때
            setSuccessMessage('(데모) 회원가입이 완료되었습니다!');
            setTimeout(() => {
                alert('로그인 페이지로 이동합니다');
                window.location.href = '/login';
            }, 2000);
        } finally {
            setIsLoading(false);
        }
    };

    // 패스워드 강도 체크
    const getPasswordStrength = () => {
        const password = formData.password;
        if (!password) return { strength: 0, text: '', color: '#e0e0e0' };

        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        const levels = [
            { strength: 0, text: '', color: '#e0e0e0' },
            { strength: 1, text: '약함', color: '#ff4444' },
            { strength: 2, text: '보통', color: '#ffaa00' },
            { strength: 3, text: '좋음', color: '#00aa00' },
            { strength: 4, text: '강함', color: '#0066cc' },
            { strength: 5, text: '매우 강함', color: '#6600cc' }
        ];

        return levels[Math.min(strength, 5)];
    };

    const passwordStrength = getPasswordStrength();

    return (
        <div style={styles.container}>
            <div style={styles.signupBox}>
                {/* 로고/타이틀 */}
                <div style={styles.header}>
                    <div style={styles.logoCircle}>
                        <UserPlus size={32} color="white" />
                    </div>
                    <h1 style={styles.title}>회원가입</h1>
                    <p style={styles.subtitle}>Social Hub에 가입하세요</p>
                </div>

                {/* 성공 메시지 */}
                {successMessage && (
                    <div style={styles.successBox}>
                        <Check size={20} style={{ marginRight: '8px' }} />
                        {successMessage}
                    </div>
                )}

                {/* 에러 메시지 */}
                {errors.general && (
                    <div style={styles.errorBox}>
                        <X size={20} style={{ marginRight: '8px' }} />
                        {errors.general}
                    </div>
                )}

                {/* 회원가입 폼 */}
                <form onSubmit={handleSubmit}>
                    {/* 아이디 입력 */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>
                            아이디 <span style={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            name="userName"
                            value={formData.userName}
                            onChange={handleChange}
                            placeholder="영문, 숫자 4자 이상"
                            style={{
                                ...styles.input,
                                ...(errors.userName ? styles.inputError : {})
                            }}
                            disabled={isLoading}
                        />
                        {errors.userName && (
                            <span style={styles.errorText}>{errors.userName}</span>
                        )}
                    </div>

                    {/* 닉네임 입력 */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>
                            닉네임 <span style={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            name="displayName"
                            value={formData.displayName}
                            onChange={handleChange}
                            placeholder="2자 이상"
                            style={{
                                ...styles.input,
                                ...(errors.displayName ? styles.inputError : {})
                            }}
                            disabled={isLoading}
                        />
                        {errors.displayName && (
                            <span style={styles.errorText}>{errors.displayName}</span>
                        )}
                    </div>

                    {/* 비밀번호 입력 */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>
                            비밀번호 <span style={styles.required}>*</span>
                        </label>
                        <div style={styles.passwordWrapper}>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="6자 이상"
                                style={{
                                    ...styles.input,
                                    ...(errors.password ? styles.inputError : {})
                                }}
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

                        {/* 비밀번호 강도 표시 */}
                        {formData.password && (
                            <div style={styles.strengthContainer}>
                                <div style={styles.strengthBar}>
                                    <div style={{
                                        ...styles.strengthFill,
                                        width: `${passwordStrength.strength * 20}%`,
                                        backgroundColor: passwordStrength.color
                                    }} />
                                </div>
                                <span style={styles.strengthText}>{passwordStrength.text}</span>
                            </div>
                        )}

                        {errors.password && (
                            <span style={styles.errorText}>{errors.password}</span>
                        )}
                    </div>

                    {/* 비밀번호 확인 */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>
                            비밀번호 확인 <span style={styles.required}>*</span>
                        </label>
                        <div style={styles.passwordWrapper}>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="비밀번호를 다시 입력하세요"
                                style={{
                                    ...styles.input,
                                    ...(errors.confirmPassword ? styles.inputError : {})
                                }}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={styles.eyeButton}
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <span style={styles.errorText}>{errors.confirmPassword}</span>
                        )}
                    </div>

                    {/* 가입 버튼 */}
                    <button
                        type="submit"
                        style={{
                            ...styles.signupButton,
                            ...(isLoading ? styles.signupButtonDisabled : {})
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? '처리 중...' : '가입하기'}
                    </button>
                </form>

                {/* 로그인 링크 */}
                <div style={styles.footer}>
                    <span>이미 계정이 있으신가요? </span>
                    <a href="/login" style={styles.loginLink}>
                        로그인
                    </a>
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
    signupBox: {
        width: '100%',
        maxWidth: '450px',
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
    successBox: {
        background: '#d4edda',
        color: '#155724',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '14px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    errorBox: {
        background: '#fee',
        color: '#c00',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '14px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputGroup: {
        marginBottom: '18px'
    },
    label: {
        display: 'block',
        fontSize: '14px',
        fontWeight: '600',
        color: '#333',
        marginBottom: '8px'
    },
    required: {
        color: '#ff4444'
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
    inputError: {
        borderColor: '#ff4444'
    },
    errorText: {
        display: 'block',
        fontSize: '12px',
        color: '#ff4444',
        marginTop: '5px'
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
    strengthContainer: {
        marginTop: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    strengthBar: {
        flex: 1,
        height: '6px',
        background: '#e0e0e0',
        borderRadius: '3px',
        overflow: 'hidden'
    },
    strengthFill: {
        height: '100%',
        transition: 'width 0.3s, background-color 0.3s'
    },
    strengthText: {
        fontSize: '12px',
        color: '#666',
        minWidth: '60px'
    },
    signupButton: {
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
        marginTop: '20px'
    },
    signupButtonDisabled: {
        opacity: 0.6,
        cursor: 'not-allowed'
    },
    footer: {
        textAlign: 'center',
        marginTop: '30px',
        fontSize: '14px',
        color: '#666'
    },
    loginLink: {
        color: '#667eea',
        textDecoration: 'none',
        fontWeight: 'bold'
    }
};

export default SignupPage;