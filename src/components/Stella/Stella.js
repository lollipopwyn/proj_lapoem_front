import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { WEBSOCKET_CHAT_URL, API_CHAT_URL, GET_BOOK_DETAIL_API_URL } from '../../util/apiUrl';
import { initializeAuth } from '../../redux/features/auth/authSlice';
import './Stella.css';

const MAX_RECONNECT_ATTEMPTS = 1; // 최대 재연결 시도 횟수
const INITIAL_RECONNECT_DELAY = 1000; // 초기 재연결 지연 시간 (1초)

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
  const reconnectAttemptsRef = useRef(0);
  const reconnectDelayRef = useRef(INITIAL_RECONNECT_DELAY);

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
      alertShownRef.current = true;

      const shouldNavigateToLogin = window.confirm('회원 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?');

      if (shouldNavigateToLogin) {
        navigate('/login');
      } else {
        navigate('/');
      }
    }

    return () => {
      alertShownRef.current = false;
    };
  }, [isAuthInitializing, isLoggedIn, navigate]);

  // 책 정보 및 채팅 내역 불러오기
  useEffect(() => {
    if (!authInitialized || !isLoggedIn) return;

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

  // WebSocket 연결 관리
  useEffect(() => {
    if (!authInitialized || !isLoggedIn || !user) return;

    // WebSocket 인스턴스가 이미 존재할 경우 새로운 연결 방지
    if (socket) {
      return;
    }

    let ws; // WebSocket 인스턴스 선언

    const connectWebSocket = () => {
      if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
        console.log('Maximum reconnect attempts reached. Stopping reconnect attempts.');
        return; // 최대 재연결 횟수 도달 시 재연결 중단
      }

      const wsUrl = `${WEBSOCKET_CHAT_URL}?member_num=${user.memberNum}&book_id=${effectiveBookId}`;
      ws = new WebSocket(wsUrl);
      setSocket(ws);

      ws.onopen = () => {
        console.log('Connected to the chat server');
        setIsSocketOpen(true);
        reconnectAttemptsRef.current = 0; // 연결이 성공하면 재연결 횟수 초기화
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('Disconnected from chat server');
        setIsSocketOpen(false);
        setSocket(null); // 연결이 닫히면 socket 상태를 null로 설정

        // 재연결 로직
        if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          setTimeout(connectWebSocket, reconnectDelayRef.current); // 재연결 시도
          reconnectAttemptsRef.current += 1;
          reconnectDelayRef.current *= 2; // 재연결 지연 시간 증가
        }
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
      if (ws) {
        ws.close(); // 컴포넌트가 언마운트될 때 기존 WebSocket 연결 해제
      }
      reconnectAttemptsRef.current = 0; // 컴포넌트 언마운트 시 재연결 횟수 초기화
      reconnectDelayRef.current = INITIAL_RECONNECT_DELAY; // 재연결 지연 시간 초기화
    };
  }, [isLoggedIn, authInitialized, user, effectiveBookId]);

  // 채팅 기록 스크롤 관리
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // 메시지 전송 함수
  // handleSendMessage 함수 수정
  const handleSendMessage = async () => {
    if (isSocketOpen && socket.readyState === WebSocket.OPEN && message.trim()) {
      // 사용자 메시지를 WebSocket을 통해 서버로 전송
      const userMessage = { sender_id: 'user', message: message.trim() };
      socket.send(JSON.stringify(userMessage));

      // 사용자가 입력한 메시지를 채팅 기록에 추가
      setChatHistory((prev) => [...prev, userMessage]);

      // 메시지 입력 필드를 초기화
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
