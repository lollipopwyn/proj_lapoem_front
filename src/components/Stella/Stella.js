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
  const [bookInfo, setBookInfo] = useState(null); // 책 정보 상태 추가
  const chatBoxRef = useRef(null);
  const alertShownRef = useRef(false); // alert가 한 번만 표시되도록 상태 관리
  const { isLoggedIn, isAuthInitializing, authInitialized, user } = useSelector((state) => state.auth);

  // 인증 초기화
  useEffect(() => {
    if (!authInitialized) {
      dispatch(initializeAuth());
    }
  }, [authInitialized, dispatch]);

  // 로그인 상태 확인 및 리다이렉트
  useEffect(() => {
    if (isAuthInitializing) return;
    if (!isLoggedIn && !alertShownRef.current) {
      alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
      alertShownRef.current = true;
      navigate('/login');
    }
  }, [isAuthInitializing, authInitialized, isLoggedIn, navigate]);

  // 책 정보 불러오기 및 환영 메시지 초기화
  useEffect(() => {
    const loadBookInfo = async () => {
      if (bookId) {
        try {
          const response = await axios.get(GET_BOOK_DETAIL_API_URL(bookId));
          setBookInfo(response.data);

          // 환영 메시지를 채팅 기록에 바로 추가
          const welcomeMessage = {
            sender_id: 'stella',
            message: `${response.data.book_title} 채팅방에 오신 것을 환영합니다!`,
          };
          setChatHistory([welcomeMessage]); // 환영 인사를 chatHistory에 초기값으로 설정
        } catch (error) {
          console.error('Failed to load book information:', error);
        }
      }
    };
    loadBookInfo();
  }, [bookId]);

  // WebSocket 연결 및 채팅 초기화
  useEffect(() => {
    if (!authInitialized || !isLoggedIn || !bookInfo) return;

    const loadChatHistory = async () => {
      if (bookId) {
        try {
          const response = await axios.get(`${API_CHAT_URL}/${bookId}/${user.memberNum}`);
          setChatHistory((prev) => [...prev, ...response.data]); // 기존 환영 인사 뒤에 불러온 채팅 기록 추가
        } catch (error) {
          console.error('Failed to load chat history:', error);
        }
      }
    };

    loadChatHistory();

    const wsUrl = bookId
      ? `${WEBSOCKET_CHAT_URL}?member_num=${user.memberNum}&book_id=${bookId}`
      : `${WEBSOCKET_CHAT_URL}?member_num=${user.memberNum}`;
    const ws = new WebSocket(wsUrl);
    setSocket(ws);

    ws.onopen = () => {
      console.log('Connected to the chat server');
    };

    ws.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      setIsTyping(false);
      if (receivedMessage.message.trim()) {
        setChatHistory((prev) => [...prev, receivedMessage]);
      }
    };

    ws.onclose = () => {
      console.log('Disconnected from chat server');
    };

    return () => {
      ws.close();
    };
  }, [isLoggedIn, isAuthInitializing, authInitialized, user, bookId, navigate, bookInfo]);

  // 채팅 기록 스크롤 관리
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN && message.trim()) {
      const userMessage = { sender_id: 'user', message: message.trim() };
      socket.send(message.trim());
      setChatHistory((prev) => [...prev, userMessage]);
      setMessage('');
      setIsTyping(true);
    } else {
      console.log('WebSocket is not open or message is empty');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
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
