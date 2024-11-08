import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { WEBSOCKET_CHAT_URL, API_CHAT_URL, GET_BOOK_DETAIL_API_URL } from '../../util/apiUrl';
import { initializeAuth } from '../../redux/features/auth/authSlice';
import './Stella.css';

const Stella = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [bookInfo, setBookInfo] = useState(null);
  const chatBoxRef = useRef(null);
  const alertShownRef = useRef(false);
  const { isLoggedIn, isAuthInitializing, authInitialized, user } = useSelector((state) => state.auth);
  const [isSocketOpen, setIsSocketOpen] = useState(false);

  // bookId가 없는 경우 0으로 설정
  const effectiveBookId = bookId || 0;

  // 인증 초기화
  useEffect(() => {
    if (!authInitialized) {
      dispatch(initializeAuth());
    }
  }, [authInitialized, dispatch]);

  // 로그인 상태 확인 및 리다이렉트
  useEffect(() => {
    if (!isAuthInitializing && !isLoggedIn && !alertShownRef.current) {
      alertShownRef.current = true; // 알림 표시 여부 설정

      const shouldNavigateToLogin = window.confirm('회원 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?');

      if (shouldNavigateToLogin) {
        navigate('/login'); // "확인"을 누르면 로그인 페이지로 이동
      } else {
        navigate('/'); // "취소"를 누르면 홈으로 이동
      }
    }

    // 컴포넌트 언마운트 시 `alertShownRef`를 초기화하여 다시 표시되지 않도록 설정
    return () => {
      alertShownRef.current = true;
    };
  }, [isAuthInitializing, isLoggedIn, navigate]);

  // 책 정보 및 채팅 내역 불러오기
  useEffect(() => {
    if (!authInitialized || !isLoggedIn) return; // 조건 확인 후 훅 실행
    const loadBookInfoAndChatHistory = async () => {
      try {
        if (effectiveBookId && user && user.memberNum) {
          const bookResponse = await axios.get(GET_BOOK_DETAIL_API_URL(effectiveBookId));
          setBookInfo(bookResponse.data);

          const chatResponse = await axios.get(`${API_CHAT_URL}/${effectiveBookId}/${user.memberNum}`);
          setChatHistory(chatResponse.data);

          const welcomeMessage = {
            sender_id: 'stella',
            message: `${bookResponse.data.book_title || '일회성'} 채팅방에 오신 것을 환영합니다!`,
          };
          setChatHistory((prev) => [welcomeMessage, ...prev]);
        }
      } catch (error) {
        console.error('Failed to load book information or chat history:', error);
      }
    };

    loadBookInfoAndChatHistory();
  }, [effectiveBookId, authInitialized, isLoggedIn, user]);

  // WebSocket 연결 및 재연결 관리
  useEffect(() => {
    if (!authInitialized || !isLoggedIn || !user) return; // 조건 확인 후 훅 실행

    const connectWebSocket = () => {
      const wsUrl = `${WEBSOCKET_CHAT_URL}?member_num=${user.memberNum}&book_id=${effectiveBookId}`;

      const ws = new WebSocket(wsUrl);
      setSocket(ws);

      ws.onopen = () => {
        console.log('Connected to the chat server');
        setIsSocketOpen(true);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('Disconnected from chat server, attempting to reconnect...');
        setIsSocketOpen(false);
        setSocket(null);
        setTimeout(connectWebSocket, 3000); // 3초 후 재연결 시도
      };

      ws.onmessage = (event) => {
        const receivedMessage = JSON.parse(event.data);
        setIsTyping(false);
        if (receivedMessage.message.trim()) {
          setChatHistory((prev) => [...prev, receivedMessage]);
        }
      };
    };

    connectWebSocket();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [isLoggedIn, authInitialized, user, effectiveBookId]);

  // 채팅 기록 스크롤 관리
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // 메시지 전송 함수
  const handleSendMessage = () => {
    if (isSocketOpen && message.trim()) {
      const userMessage = { sender_id: 'user', message: message.trim() };
      socket.send(message.trim());
      setChatHistory((prev) => [...prev, userMessage]);
      setMessage('');
      setIsTyping(true);
    } else {
      console.log('WebSocket is not open or message is empty');
    }
  };

  // Enter 키 이벤트와 클릭 이벤트에서 중복 방지
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.repeat) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isAuthInitializing) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="stella_container">
      <div className="stella_chat_area">
        <div className="stella_chat_box" ref={chatBoxRef}>
          {chatHistory.map((chat, index) => (
            <div
              key={index}
              className={`stella_chat_message ${chat.sender_id === 'user' ? 'stella_user' : 'stella_bot'}`}
            >
              {chat.message}
            </div>
          ))}
          {isTyping && <div className="stella_typing">Stella가 입력 중입니다...</div>}
        </div>
        <div className="stella_input_container">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="stella_input"
          />
          <button onClick={handleSendMessage} className="stella_send_button">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Stella;
