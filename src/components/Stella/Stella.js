import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { WEBSOCKET_CHAT_URL, API_CHAT_URL } from '../../util/apiUrl';
import { initializeAuth } from '../../redux/features/auth/authSlice';
import './Stella.css';

const Stella = () => {
  const { bookId } = useParams(); // bookId 가져오기
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const chatBoxRef = useRef(null);
  const alertShownRef = useRef(false); // alert가 한 번만 표시되도록 상태 관리
  const { isLoggedIn, isAuthInitializing, authInitialized, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!authInitialized) {
      dispatch(initializeAuth());
    }
  }, [authInitialized, dispatch]);

  useEffect(() => {
    if (isAuthInitializing) return;

    // alert가 이미 한 번 표시되었는지 확인하여 중복 호출 방지
    if (!isLoggedIn && !alertShownRef.current) {
      alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
      alertShownRef.current = true; // alert가 이미 표시되었음을 기록
      navigate('/login');
    }
  }, [isAuthInitializing, authInitialized, isLoggedIn, navigate]);

  useEffect(() => {
    if (!authInitialized || !isLoggedIn) return;

    // **채팅 기록 불러오기 부분을 조건부로 변경**
    const loadChatHistory = async () => {
      if (bookId) {
        // **여기 추가된 조건: bookId가 있을 때만 채팅 기록 불러오기**
        try {
          const response = await axios.get(`${API_CHAT_URL}/${bookId}/${user.memberNum}`);
          setChatHistory(response.data);
        } catch (error) {
          console.error('Failed to load chat history:', error);
        }
      }
    };

    loadChatHistory();

    // WebSocket 연결 URL 조건 설정
    const wsUrl = bookId
      ? `${WEBSOCKET_CHAT_URL}?member_num=${user.memberNum}&book_id=${bookId}`
      : `${WEBSOCKET_CHAT_URL}?member_num=${user.memberNum}`; // **bookId가 없는 경우 member_num만 포함한 URL 사용**
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
  }, [isLoggedIn, isAuthInitializing, authInitialized, user, bookId, navigate]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN && message.trim()) {
      const userMessage = { sender_id: 'user', message: message.trim() };
      console.log('Sending message:', message.trim());
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
            onKeyPress={handleKeyPress} // 엔터키 이벤트 추가
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
