import React, { useState, useEffect } from 'react';
import { 
  User, Lock, UserPlus, Eye, EyeOff, Check, X, ChevronDown,
  MessageSquare, Edit2, Trash2, LogIn, LogOut, Settings,
  PlusCircle, RefreshCw, Clock, Heart, MessageCircle,
  TrendingUp, Users, Hash, Search, Bell, Home
} from 'lucide-react';

const SocialApp = () => {
  // 상태 관리
  const [currentView, setCurrentView] = useState('login'); // login, signup, main
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
  const [showPostDetail, setShowPostDetail] = useState(false);
  
  // API 베이스 URL
  const API_BASE = 'http://localhost:8080/api';
  
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
      
      // 유효성 검사
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
      
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE}/members`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userName: formData.userName,
            displayName: formData.displayName,
            password: formData.password
          })
        });
        
        if (response.ok) {
          alert('회원가입이 완료되었습니다!');
          setCurrentView('login');
        } else {
          setErrors({ general: '회원가입에 실패했습니다' });
        }
      } catch (error) {
        console.error('Signup error:', error);
        // 데모 모드
        alert('(데모) 회원가입 완료!');
        setCurrentView('login');
      } finally {
        setIsLoading(false);
      }
    };
    
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-10 border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
              <UserPlus className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Join Social Hub
            </h2>
            <p className="text-gray-600 mt-2">새로운 소셜 경험을 시작하세요</p>
          </div>
          
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <p className="text-red-700 text-sm">{errors.general}</p>
            </div>
          )}
          
          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">아이디</label>
              <input
                type="text"
                value={formData.userName}
                onChange={(e) => setFormData({...formData, userName: e.target.value})}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
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
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
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
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
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
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="비밀번호를 다시 입력"
              />
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '처리 중...' : '가입하기'}
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
    );
  };
  
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
        const response = await fetch(`${API_BASE}/members`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userName: loginData.userName,
            password: loginData.password
          })
        });
        
        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
          setCurrentView('main');
        } else {
          setErrors({ general: '로그인에 실패했습니다' });
        }
      } catch (error) {
        console.error('Login error:', error);
        // 데모 모드
        setCurrentUser({
          id: 1,
          userName: loginData.userName,
          displayName: loginData.userName,
          createdAt: new Date().toISOString()
        });
        setCurrentView('main');
      } finally {
        setIsLoading(false);
      }
    };
    
    return (
      <div className="w-full max-w-md mx-auto">
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
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
    );
  };
  
  // =============== 메인 화면 컴포넌트 ===============
  const MainView = () => {
    const [newPost, setNewPost] = useState({ title: '', body: '' });
    const [editPost, setEditPost] = useState({ title: '', body: '' });
    const [newDisplayName, setNewDisplayName] = useState('');
    const [activeTab, setActiveTab] = useState('all'); // all, liked, my
    
    // 게시글 목록 조회
    const fetchPosts = async (isLoadMore = false) => {
      setIsLoading(true);
      try {
        const url = new URL(`${API_BASE}/posts`);
        if (isLoadMore && lastCreatedAt) {
          url.searchParams.append('lastCreatedAt', lastCreatedAt);
        }
        url.searchParams.append('size', '10');
        
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          if (isLoadMore) {
            setPosts([...posts, ...data.posts]);
          } else {
            setPosts(data.posts);
          }
          setHasMore(data.hasNext);
          if (data.posts.length > 0) {
            setLastCreatedAt(data.posts[data.posts.length - 1].createdAt);
          }
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        // 데모 데이터
        if (!isLoadMore) {
          setPosts([
            {
              id: 1,
              title: '첫 번째 게시글입니다',
              body: '안녕하세요! Social Hub에 오신 것을 환영합니다. 이곳에서 다양한 사람들과 소통해보세요.',
              memberId: 1,
              memberDisplayName: currentUser?.displayName || 'User1',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              likes: [
                { likeId: 1, memberId: 2, memberName: 'User2' },
                { likeId: 2, memberId: 3, memberName: 'User3' }
              ],
              likeCount: 2,
              commentCount: 5
            },
            {
              id: 2,
              title: '오늘의 개발 일지',
              body: 'React와 Spring Boot를 연동하여 소셜 플랫폼을 만들고 있습니다. 좋아요 기능과 댓글 기능을 구현중입니다!',
              memberId: 2,
              memberDisplayName: 'Developer',
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              updatedAt: new Date(Date.now() - 86400000).toISOString(),
              likes: [
                { likeId: 3, memberId: 1, memberName: currentUser?.displayName || 'User1' }
              ],
              likeCount: 1,
              commentCount: 3
            },
            {
              id: 3,
              title: '디자인 패턴 공부',
              body: '오늘은 싱글톤 패턴과 팩토리 패턴에 대해 공부했습니다. 실무에서 많이 사용되는 패턴들이네요.',
              memberId: 3,
              memberDisplayName: 'StudyMaster',
              createdAt: new Date(Date.now() - 172800000).toISOString(),
              updatedAt: new Date(Date.now() - 172800000).toISOString(),
              likes: [],
              likeCount: 0,
              commentCount: 0
            }
          ]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    // 게시글 생성
    const handleCreatePost = async () => {
      if (!newPost.title || !newPost.body) {
        alert('제목과 내용을 모두 입력해주세요');
        return;
      }
      
      try {
        const response = await fetch(`${API_BASE}/posts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            memberId: currentUser.id,
            title: newPost.title,
            body: newPost.body
          })
        });
        
        if (response.ok) {
          setNewPost({ title: '', body: '' });
          setShowNewPost(false);
          fetchPosts();
        }
      } catch (error) {
        console.error('Error creating post:', error);
        // 데모 모드
        const demoPost = {
          id: posts.length + 1,
          title: newPost.title,
          body: newPost.body,
          memberId: currentUser.id,
          memberDisplayName: currentUser.displayName,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          likes: [],
          likeCount: 0,
          commentCount: 0
        };
        setPosts([demoPost, ...posts]);
        setNewPost({ title: '', body: '' });
        setShowNewPost(false);
      }
    };
    
    // 게시글 수정
    const handleUpdatePost = async (postId) => {
      if (!editPost.title || !editPost.body) {
        alert('제목과 내용을 모두 입력해주세요');
        return;
      }
      
      try {
        const response = await fetch(`${API_BASE}/posts/${postId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: editPost.title,
            body: editPost.body
          })
        });
        
        if (response.ok) {
          setShowEditPost(false);
          fetchPosts();
        }
      } catch (error) {
        console.error('Error updating post:', error);
        // 데모 모드
        setPosts(posts.map(p => 
          p.id === postId 
            ? { ...p, title: editPost.title, body: editPost.body, updatedAt: new Date().toISOString() }
            : p
        ));
        setShowEditPost(false);
      }
    };
    
    // 게시글 삭제
    const handleDeletePost = async (postId) => {
      if (!confirm('정말 삭제하시겠습니까?')) return;
      
      try {
        const response = await fetch(`${API_BASE}/posts/${postId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          fetchPosts();
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        // 데모 모드
        setPosts(posts.filter(p => p.id !== postId));
      }
    };
    
    // 좋아요 토글
    const handleLikeToggle = async (postId) => {
      const post = posts.find(p => p.id === postId);
      const myLike = post?.likes?.find(like => like.memberId === currentUser.id);
      
      try {
        if (myLike) {
          // 좋아요 취소
          const response = await fetch(`${API_BASE}/likes/${myLike.likeId}/delete`, {
            method: 'DELETE'
          });
          
          if (response.ok) {
            setPosts(posts.map(p => {
              if (p.id === postId) {
                return {
                  ...p,
                  likes: p.likes.filter(l => l.likeId !== myLike.likeId),
                  likeCount: p.likeCount - 1
                };
              }
              return p;
            }));
          }
        } else {
          // 좋아요 추가
          const response = await fetch(`${API_BASE}/posts/${postId}/likes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ memberId: currentUser.id })
          });
          
          if (response.ok) {
            setPosts(posts.map(p => {
              if (p.id === postId) {
                const newLike = {
                  likeId: Date.now(), // 임시 ID
                  memberId: currentUser.id,
                  memberName: currentUser.displayName
                };
                return {
                  ...p,
                  likes: [...(p.likes || []), newLike],
                  likeCount: p.likeCount + 1
                };
              }
              return p;
            }));
          }
        }
      } catch (error) {
        console.error('Error toggling like:', error);
        // 데모 모드에서도 동일하게 동작
        if (myLike) {
          setPosts(posts.map(p => {
            if (p.id === postId) {
              return {
                ...p,
                likes: p.likes.filter(l => l.memberId !== currentUser.id),
                likeCount: p.likeCount - 1
              };
            }
            return p;
          }));
        } else {
          setPosts(posts.map(p => {
            if (p.id === postId) {
              const newLike = {
                likeId: Date.now(),
                memberId: currentUser.id,
                memberName: currentUser.displayName
              };
              return {
                ...p,
                likes: [...(p.likes || []), newLike],
                likeCount: p.likeCount + 1
              };
            }
            return p;
          }));
        }
      }
    };
    
    // 닉네임 변경
    const handleUpdateDisplayName = async () => {
      if (!newDisplayName || newDisplayName.length < 2) {
        alert('닉네임은 2자 이상이어야 합니다');
        return;
      }
      
      try {
        const response = await fetch(`${API_BASE}/members/updateName`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userName: currentUser.userName,
            password: currentUser.password,
            displayName: newDisplayName
          })
        });
        
        if (response.ok) {
          setCurrentUser({ ...currentUser, displayName: newDisplayName });
          setNewDisplayName('');
          setShowSettings(false);
          alert('닉네임이 변경되었습니다');
        }
      } catch (error) {
        console.error('Error updating display name:', error);
        // 데모 모드
        setCurrentUser({ ...currentUser, displayName: newDisplayName });
        setNewDisplayName('');
        setShowSettings(false);
        alert('(데모) 닉네임이 변경되었습니다');
      }
    };
    
    // 회원 탈퇴
    const handleDeleteAccount = async () => {
      if (!confirm('정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;
      
      try {
        const response = await fetch(`${API_BASE}/members`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userName: currentUser.userName,
            password: currentUser.password
          })
        });
        
        if (response.ok) {
          alert('회원 탈퇴가 완료되었습니다');
          setCurrentUser(null);
          setCurrentView('login');
        }
      } catch (error) {
        console.error('Error deleting account:', error);
        // 데모 모드
        alert('(데모) 회원 탈퇴가 완료되었습니다');
        setCurrentUser(null);
        setCurrentView('login');
      }
    };
    
    // 필터링된 게시글
    const getFilteredPosts = () => {
      let filtered = posts;
      
      // 탭 필터링
      if (activeTab === 'liked') {
        filtered = filtered.filter(post => 
          post.likes?.some(like => like.memberId === currentUser.id)
        );
      } else if (activeTab === 'my') {
        filtered = filtered.filter(post => post.memberId === currentUser.id);
      }
      
      // 검색 필터링
      if (searchQuery) {
        filtered = filtered.filter(post => 
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.memberDisplayName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      return filtered;
    };
    
    // 컴포넌트 마운트 시 게시글 로드
    useEffect(() => {
      fetchPosts();
    }, []);
    
    const filteredPosts = getFilteredPosts();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* 헤더 */}
        <header className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-xl font-bold text-gray-800 hidden md:block">Social Hub</h1>
                </div>
                
                {/* 검색바 */}
                <div className="relative hidden md:block">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="검색..."
                    className="w-80 px-4 py-2 pl-10 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                  <Bell size={22} className="text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {currentUser?.displayName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-gray-800">{currentUser?.displayName}</p>
                    <p className="text-xs text-gray-500">@{currentUser?.userName}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSettings(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Settings size={22} className="text-gray-600" />
                </button>
                <button
                  onClick={() => {
                    setCurrentUser(null);
                    setCurrentView('login');
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <LogOut size={22} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* 메인 컨텐츠 */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* 왼쪽 사이드바 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-20">
                {/* 프로필 섹션 */}
                <div className="flex flex-col items-center pb-6 border-b">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <span className="text-white font-bold text-3xl">
                      {currentUser?.displayName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-800">{currentUser?.displayName}</h3>
                  <p className="text-sm text-gray-500">@{currentUser?.userName}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    가입일: {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : '2024-01-01'}
                  </p>
                </div>
                
                {/* 통계 */}
                <div className="grid grid-cols-3 gap-2 py-6 border-b">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">{posts.filter(p => p.memberId === currentUser?.id).length}</p>
                    <p className="text-xs text-gray-500">게시글</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">
                      {posts.reduce((acc, post) => 
                        acc + (post.likes?.some(l => l.memberId === currentUser?.id) ? 1 : 0), 0
                      )}
                    </p>
                    <p className="text-xs text-gray-500">좋아요</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">128</p>
                    <p className="text-xs text-gray-500">팔로워</p>
                  </div>
                </div>
                
                {/* 새 게시글 버튼 */}
                <button
                  onClick={() => setShowNewPost(true)}
                  className="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2"
                >
                  <PlusCircle size={20} />
                  <span>새 게시글 작성</span>
                </button>
              </div>
            </div>
            
            {/* 메인 피드 */}
            <div className="lg:col-span-2">
              {/* 탭 메뉴 */}
              <div className="bg-white rounded-2xl shadow-sm mb-4 p-1">
                <div className="flex space-x-1">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition ${
                      activeTab === 'all' 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Home size={18} className="inline mr-2" />
                    모든 게시글
                  </button>
                  <button
                    onClick={() => setActiveTab('liked')}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition ${
                      activeTab === 'liked' 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Heart size={18} className="inline mr-2" />
                    좋아요한 글
                  </button>
                  <button
                    onClick={() => setActiveTab('my')}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition ${
                      activeTab === 'my' 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <User size={18} className="inline mr-2" />
                    내 게시글
                  </button>
                </div>
              </div>
              
              {/* 게시글 목록 */}
              <div className="space-y-4">
                {filteredPosts.map(post => {
                  const isLiked = post.likes?.some(like => like.memberId === currentUser.id);
                  const isMyPost = post.memberId === currentUser.id;
                  
                  return (
                    <div key={post.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                      <div className="p-6">
                        {/* 게시글 헤더 */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold">
                                {post.memberDisplayName?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">{post.memberDisplayName}</p>
                              <p className="text-xs text-gray-500 flex items-center">
                                <Clock size={12} className="mr-1" />
                                {new Date(post.createdAt).toLocaleString('ko-KR', { 
                                  month: 'long', 
                                  day: 'numeric', 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </p>
                            </div>
                          </div>
                          
                          {isMyPost && (
                            <div className="flex space-x-1">
                              <button
                                onClick={() => {
                                  setEditPost({ title: post.title, body: post.body });
                                  setSelectedPost(post);
                                  setShowEditPost(true);
                                }}
                                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => handleDeletePost(post.id)}
                                className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          )}
                        </div>
                        
                        {/* 게시글 내용 */}
                        <h3 className="text-xl font-bold text-gray-800 mb-3">{post.title}</h3>
                        <p className="text-gray-600 whitespace-pre-wrap mb-4 leading-relaxed">{post.body}</p>
                        
                        {post.updatedAt !== post.createdAt && (
                          <p className="text-xs text-gray-400 mb-4">
                            (수정됨: {new Date(post.updatedAt).toLocaleString('ko-KR')})
                          </p>
                        )}
                        
                        {/* 게시글 액션 */}
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => handleLikeToggle(post.id)}
                              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                                isLiked 
                                  ? 'bg-red-50 text-red-600' 
                                  : 'hover:bg-gray-100 text-gray-600'
                              }`}
                            >
                              <Heart 
                                size={20} 
                                className={isLiked ? 'fill-current' : ''} 
                              />
                              <span className="font-semibold">{post.likeCount || 0}</span>
                            </button>
                            
                            <button
                              onClick={() => {
                                setSelectedPost(post);
                                setShowPostDetail(true);
                              }}
                              className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition text-gray-600"
                            >
                              <MessageCircle size={20} />
                              <span className="font-semibold">{post.commentCount || 0}</span>
                            </button>
                          </div>
                          
                          {/* 좋아요한 사람들 */}
                          {post.likes && post.likes.length > 0 && (
                            <div className="flex items-center space-x-1">
                              <span className="text-xs text-gray-500 mr-2">좋아요:</span>
                              {post.likes.slice(0, 3).map((like, idx) => (
                                <div 
                                  key={idx}
                                  className="w-7 h-7 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center -ml-2 first:ml-0 border-2 border-white"
                                  title={like.memberName}
                                >
                                  <span className="text-white text-xs font-semibold">
                                    {like.memberName?.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              ))}
                              {post.likes.length > 3 && (
                                <span className="text-xs text-gray-500 ml-1">
                                  +{post.likes.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {/* 더보기 버튼 */}
                {hasMore && activeTab === 'all' && (
                  <button
                    onClick={() => fetchPosts(true)}
                    disabled={isLoading}
                    className="w-full py-3 bg-white text-gray-700 rounded-2xl font-semibold hover:shadow-md transition flex items-center justify-center space-x-2"
                  >
                    <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
                    <span>{isLoading ? '불러오는 중...' : '더 보기'}</span>
                  </button>
                )}
                
                {filteredPosts.length === 0 && !isLoading && (
                  <div className="text-center py-16 bg-white rounded-2xl">
                    <MessageSquare className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">게시글이 없습니다</p>
                    <p className="text-gray-400 text-sm mt-2">
                      {activeTab === 'liked' 
                        ? '좋아요한 게시글이 없습니다' 
                        : activeTab === 'my'
                        ? '작성한 게시글이 없습니다'
                        : '첫 번째 게시글을 작성해보세요!'}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* 오른쪽 사이드바 */}
            <div className="lg:col-span-1">
              {/* 트렌딩 */}
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                  <TrendingUp className="mr-2 text-blue-600" size={20} />
                  트렌딩 토픽
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between group cursor-pointer">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 group-hover:text-blue-600">
                        <Hash size={14} className="inline mr-1" />React
                      </p>
                      <p className="text-xs text-gray-500">1,234 게시글</p>
                    </div>
                    <span className="text-xs text-gray-400">🔥</span>
                  </div>
                  <div className="flex items-center justify-between group cursor-pointer">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 group-hover:text-blue-600">
                        <Hash size={14} className="inline mr-1" />SpringBoot
                      </p>
                      <p className="text-xs text-gray-500">892 게시글</p>
                    </div>
                    <span className="text-xs text-gray-400">🔥</span>
                  </div>
                  <div className="flex items-center justify-between group cursor-pointer">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 group-hover:text-blue-600">
                        <Hash size={14} className="inline mr-1" />개발일지
                      </p>
                      <p className="text-xs text-gray-500">567 게시글</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 추천 사용자 */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                  <Users className="mr-2 text-purple-600" size={20} />
                  추천 사용자
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">T</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">TechGuru</p>
                        <p className="text-xs text-gray-500">@techguru</p>
                      </div>
                    </div>
                    <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
                      팔로우
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">D</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Designer</p>
                        <p className="text-xs text-gray-500">@designer</p>
                      </div>
                    </div>
                    <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
                      팔로우
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        {/* 새 게시글 모달 */}
        {showNewPost && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">새 게시글 작성</h3>
              <input
                type="text"
                placeholder="제목을 입력하세요"
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
              />
              <textarea
                placeholder="무슨 생각을 하고 계신가요?"
                value={newPost.body}
                onChange={(e) => setNewPost({...newPost, body: e.target.value})}
                rows="8"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowNewPost(false)}
                  className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition font-semibold"
                >
                  취소
                </button>
                <button
                  onClick={handleCreatePost}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition font-semibold"
                >
                  게시하기
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* 게시글 수정 모달 */}
        {showEditPost && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">게시글 수정</h3>
              <input
                type="text"
                placeholder="제목을 입력하세요"
                value={editPost.title}
                onChange={(e) => setEditPost({...editPost, title: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
              />
              <textarea
                placeholder="내용을 입력하세요"
                value={editPost.body}
                onChange={(e) => setEditPost({...editPost, body: e.target.value})}
                rows="8"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowEditPost(false)}
                  className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition font-semibold"
                >
                  취소
                </button>
                <button
                  onClick={() => handleUpdatePost(selectedPost.id)}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition font-semibold"
                >
                  수정하기
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* 설정 모달 */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">계정 설정</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">닉네임 변경</label>
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      placeholder={`현재: ${currentUser?.displayName}`}
                      value={newDisplayName}
                      onChange={(e) => setNewDisplayName(e.target.value)}
                      className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleUpdateDisplayName}
                      className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold"
                    >
                      변경
                    </button>
                  </div>
                </div>
                
                <div className="pt-6 border-t">
                  <button
                    onClick={handleDeleteAccount}
                    className="w-full py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-semibold"
                  >
                    회원 탈퇴
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-3">
                    이 작업은 되돌릴 수 없습니다
                  </p>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition font-semibold"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // 메인 앱 렌더링
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {currentView === 'login' && (
        <div className="flex items-center justify-center min-h-screen p-4">
          <LoginView />
        </div>
      )}
      {currentView === 'signup' && (
        <div className="flex items-center justify-center min-h-screen p-4">
          <SignupView />
        </div>
      )}
      {currentView === 'main' && <MainView />}
    </div>
  );
};

export default SocialApp;