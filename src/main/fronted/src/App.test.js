// src/main/frontend/src/App.js

import React, { useState, useEffect } from 'react';
import './App.css';

// Lucide React 아이콘들을 직접 임포트
import {
  User, Lock, UserPlus, Eye, EyeOff, Check, X,
  MessageSquare, Edit2, Trash2, LogIn, LogOut, Settings,
  PlusCircle, RefreshCw, Clock, Heart, MessageCircle,
  TrendingUp, Users, Hash, Search, Bell, Home
} from 'lucide-react';

function App() {
  // 상태 관리
  const [currentView, setCurrentView] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastCreatedAt, setLastCreatedAt] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // 모달 상태
  const [showNewPost, setShowNewPost] = useState(false);
  const [showEditPost, setShowEditPost] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // API 베이스 URL
  const API_BASE = '/api';  // Spring Boot와 같은 서버에서 실행

  // =============== 로그인 컴포넌트 ===============
  const LoginView = () => {
    const [loginData, setLoginData] = useState({ userName: '', password: '' });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
      e.preventDefault();

      if (!loginData.userName || !loginData.password) {
        setErrors({ general: '아이디와 비밀번호를 입력하세요' });
        return;
      }

      setIsLoading(true);
      try {
        // 데모 모드 - API 연결 전 테스트용
        console.log('로그인 시도:', loginData);

        // 데모 사용자 설정
        setCurrentUser({
          id: 1,
          userName: loginData.userName,
          displayName: loginData.userName,
          createdAt: new Date().toISOString()
        });
        setCurrentView('main');

      } catch (error) {
        console.error('Login error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-10 border border-gray-100">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
                  <MessageSquare className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Social Hub
                </h2>
                <p className="text-gray-600 mt-2">소셜 커뮤니티에 오신 것을 환영합니다</p>
              </div>

              {errors.general && (
                  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                    <p className="text-red-700 text-sm">{errors.general}</p>
                  </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">아이디</label>
                  <div className="relative">
                    <input
                        type="text"
                        value={loginData.userName}
                        onChange={(e) => setLoginData({...loginData, userName: e.target.value})}
                        className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        placeholder="아이디를 입력하세요"
                    />
                    <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">비밀번호</label>
                  <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        placeholder="비밀번호를 입력하세요"
                    />
                    <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50"
                >
                  {isLoading ? '로그인 중...' : '로그인'}
                </button>
              </form>

              <div className="mt-8 text-center text-sm text-gray-600">
                아직 계정이 없으신가요?{' '}
                <button
                    onClick={() => setCurrentView('signup')}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  회원가입
                </button>
              </div>
            </div>
          </div>
        </div>
    );
  };

  // =============== 회원가입 컴포넌트 ===============
  const SignupView = () => {
    const [formData, setFormData] = useState({
      userName: '',
      displayName: '',
      password: '',
      confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const handleSignup = async (e) => {
      e.preventDefault();

      const newErrors = {};
      if (!formData.userName || formData.userName.length < 4) {
        newErrors.userName = '아이디는 4자 이상이어야 합니다';
      }
      if (!formData.displayName || formData.displayName.length < 2) {
        newErrors.displayName = '닉네임은 2자 이상이어야 합니다';
      }
      if (!formData.password || formData.password.length < 6) {
        newErrors.password = '비밀번호는 6자 이상이어야 합니다';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      // 데모 모드
      alert('(데모) 회원가입이 완료되었습니다!');
      setCurrentView('login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-10 border border-gray-100">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
                  <UserPlus className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  회원가입
                </h2>
                <p className="text-gray-600 mt-2">새로운 계정을 만들어보세요</p>
              </div>

              <form onSubmit={handleSignup} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">아이디</label>
                  <input
                      type="text"
                      value={formData.userName}
                      onChange={(e) => setFormData({...formData, userName: e.target.value})}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.userName ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="영문, 숫자 4자 이상"
                  />
                  {errors.userName && <p className="mt-1 text-xs text-red-600">{errors.userName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">닉네임</label>
                  <input
                      type="text"
                      value={formData.displayName}
                      onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.displayName ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="2자 이상"
                  />
                  {errors.displayName && <p className="mt-1 text-xs text-red-600">{errors.displayName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">비밀번호</label>
                  <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.password ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder="6자 이상"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">비밀번호 확인</label>
                  <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="비밀번호를 다시 입력"
                  />
                  {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                >
                  가입하기
                </button>
              </form>

              <div className="mt-8 text-center text-sm text-gray-600">
                이미 계정이 있으신가요?{' '}
                <button
                    onClick={() => setCurrentView('login')}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  로그인
                </button>
              </div>
            </div>
          </div>
        </div>
    );
  };

  // =============== 메인 화면 ===============
  const MainView = () => {
    const [newPost, setNewPost] = useState({ title: '', body: '' });
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
      // 데모 데이터 설정
      setPosts([
        {
          id: 1,
          title: '첫 번째 게시글',
          body: '안녕하세요! Social Hub에 오신 것을 환영합니다.',
          memberId: 1,
          memberDisplayName: currentUser?.displayName || 'User1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          likes: [],
          likeCount: 0
        }
      ]);
    }, []);

    const handleCreatePost = () => {
      if (!newPost.title || !newPost.body) {
        alert('제목과 내용을 모두 입력해주세요');
        return;
      }

      const demoPost = {
        id: posts.length + 1,
        title: newPost.title,
        body: newPost.body,
        memberId: currentUser.id,
        memberDisplayName: currentUser.displayName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: [],
        likeCount: 0
      };

      setPosts([demoPost, ...posts]);
      setNewPost({ title: '', body: '' });
      setShowNewPost(false);
    };

    const handleLikeToggle = (postId) => {
      setPosts(posts.map(p => {
        if (p.id === postId) {
          const isLiked = p.likes?.includes(currentUser.id);
          return {
            ...p,
            likes: isLiked
                ? p.likes.filter(id => id !== currentUser.id)
                : [...(p.likes || []), currentUser.id],
            likeCount: isLiked ? p.likeCount - 1 : p.likeCount + 1
          };
        }
        return p;
      }));
    };

    const handleDeletePost = (postId) => {
      if (window.confirm('정말 삭제하시겠습니까?')) {
        setPosts(posts.filter(p => p.id !== postId));
      }
    };

    return (
        <div className="min-h-screen bg-gray-50">
          {/* 헤더 */}
          <header className="bg-white shadow-sm border-b sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-8 h-8 text-blue-600" />
                  <h1 className="text-xl font-bold text-gray-800">Social Hub</h1>
                </div>

                <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  안녕하세요, <span className="font-semibold">{currentUser?.displayName}</span>님
                </span>
                  <button
                      onClick={() => {
                        setCurrentUser(null);
                        setCurrentView('login');
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <LogOut size={20} className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* 메인 컨텐츠 */}
          <main className="max-w-4xl mx-auto px-4 py-8">
            {/* 새 게시글 버튼 */}
            <button
                onClick={() => setShowNewPost(true)}
                className="w-full mb-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg flex items-center justify-center space-x-2"
            >
              <PlusCircle size={20} />
              <span>새 게시글 작성</span>
            </button>

            {/* 게시글 목록 */}
            <div className="space-y-4">
              {posts.map(post => (
                  <div key={post.id} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{post.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {post.memberDisplayName} · {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {post.memberId === currentUser?.id && (
                          <button
                              onClick={() => handleDeletePost(post.id)}
                              className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
                          >
                            <Trash2 size={18} />
                          </button>
                      )}
                    </div>

                    <p className="text-gray-600 mb-4">{post.body}</p>

                    <button
                        onClick={() => handleLikeToggle(post.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                            post.likes?.includes(currentUser?.id)
                                ? 'bg-red-50 text-red-600'
                                : 'hover:bg-gray-100 text-gray-600'
                        }`}
                    >
                      <Heart size={20} className={post.likes?.includes(currentUser?.id) ? 'fill-current' : ''} />
                      <span>{post.likeCount || 0}</span>
                    </button>
                  </div>
              ))}
            </div>
          </main>

          {/* 새 게시글 모달 */}
          {showNewPost && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
                  <h3 className="text-lg font-bold mb-4">새 게시글</h3>
                  <input
                      type="text"
                      placeholder="제목"
                      value={newPost.title}
                      onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg mb-3"
                  />
                  <textarea
                      placeholder="내용"
                      value={newPost.body}
                      onChange={(e) => setNewPost({...newPost, body: e.target.value})}
                      rows="4"
                      className="w-full px-4 py-2 border rounded-lg mb-4"
                  />
                  <div className="flex justify-end space-x-3">
                    <button
                        onClick={() => setShowNewPost(false)}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      취소
                    </button>
                    <button
                        onClick={handleCreatePost}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      게시하기
                    </button>
                  </div>
                </div>
              </div>
          )}
        </div>
    );
  };

  // 조건부 렌더링
  return (
      <div className="App">
        {currentView === 'login' && <LoginView />}
        {currentView === 'signup' && <SignupView />}
        {currentView === 'main' && <MainView />}
      </div>
  );
}

export default App;