import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { WEBSOCKET_CHAT_URL, API_CHAT_URL, GET_BOOK_DETAIL_API_URL, API_CHAT_LIST_URL } from '../../util/apiUrl';
import { initializeAuth } from '../../redux/features/auth/authSlice';
import './Stella.css';

const MAX_RECONNECT_ATTEMPTS = 3;
const INITIAL_RECONNECT_DELAY = 1000;

const Stella = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(bookId || 0);
  const [isTyping, setIsTyping] = useState(false);
  const [bookInfo, setBookInfo] = useState(null);
  const chatBoxRef = useRef(null);
  const alertShownRef = useRef(false);
  const { isLoggedIn, isAuthInitializing, authInitialized, user } = useSelector((state) => state.auth);

  const [isSocketOpen, setIsSocketOpen] = useState(false);
  const reconnectAttemptsRef = useRef(0);
  const reconnectDelayRef = useRef(INITIAL_RECONNECT_DELAY);
  const wsRef = useRef(null); // WebSocket을 관리하기 위한 ref

  useEffect(() => {
    if (!authInitialized) {
      dispatch(initializeAuth());
    }
  }, [authInitialized, dispatch]);

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

  useEffect(() => {
    const loadChatRooms = async () => {
      if (user) {
        try {
          const response = await axios.get(API_CHAT_LIST_URL(user.memberNum));
          setChatRooms(response.data);
        } catch (error) {
          console.error('Failed to load chat rooms:', error);
        }
      }
    };
    loadChatRooms();
  }, [user]);

  useEffect(() => {
    const loadBookInfoAndChatHistory = async () => {
      if (selectedRoom && user) {
        try {
          const bookResponse = await axios.get(GET_BOOK_DETAIL_API_URL(selectedRoom));
          setBookInfo(bookResponse.data);

          const chatResponse = await axios.get(`${API_CHAT_URL}/${selectedRoom}/${user.memberNum}`);
          setChatHistory(chatResponse.data);

          const welcomeMessages = [
            {
              sender_id: 'stella',
              message: `${bookResponse.data.book_title || '일회성'} 채팅방에 오신 것을 환영합니다!`,
            },
            {
              sender_id: 'stella',
              message: 'ex) 이 책에 대해 설명해줘 같은 메시지를 입력해 주세요.',
            },
          ];
          setChatHistory((prev) => [...welcomeMessages, ...prev]);
        } catch (error) {
          console.error('Failed to load book information or chat history:', error);
        }
      }
    };

    loadBookInfoAndChatHistory();
  }, [selectedRoom, user]);

  // WebSocket 연결 관리
  useEffect(() => {
    if (!authInitialized || !isLoggedIn || !user || selectedRoom === null) return;

    // 기존 WebSocket 연결이 존재하면 닫기
    if (wsRef.current) {
      wsRef.current.close();
    }

    const connectWebSocket = () => {
      if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
        console.log('Maximum reconnect attempts reached. Stopping reconnect attempts.');
        return;
      }

      const wsUrl = `${WEBSOCKET_CHAT_URL}?member_num=${user.memberNum}&book_id=${selectedRoom}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws; // WebSocket 인스턴스를 ref에 저장

      ws.onopen = () => {
        console.log('Connected to the chat server');
        setIsSocketOpen(true);
        reconnectAttemptsRef.current = 0;
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('Disconnected from chat server');
        setIsSocketOpen(false);
        wsRef.current = null;

        if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          setTimeout(connectWebSocket, reconnectDelayRef.current);
          reconnectAttemptsRef.current += 1;
          reconnectDelayRef.current *= 2;
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
      if (wsRef.current) {
        wsRef.current.close(); // 기존 연결을 확실히 닫기
      }
      reconnectAttemptsRef.current = 0;
      reconnectDelayRef.current = INITIAL_RECONNECT_DELAY;
    };
  }, [selectedRoom, isLoggedIn, authInitialized, user]);

  const handleSendMessage = async () => {
    if (isSocketOpen && wsRef.current && message.trim()) {
      const userMessage = { sender_id: 'user', message: message.trim() };
      wsRef.current.send(JSON.stringify(userMessage));
      setChatHistory((prev) => [...prev, userMessage]);
      setMessage('');
      setIsTyping(true);
    } else {
      console.log('WebSocket is not open or message is empty');
    }
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // 채팅방 선택 시 새로운 대화 불러오기
  const handleRoomSelect = (bookId) => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    setSelectedRoom(bookId);
    setChatHistory([]);
    setIsSocketOpen(false);
  };

  return (
    <div className="stella_container">
      <div className="stella_sidebar">
        <h3>채팅방 목록</h3>
        <ul>
          {chatRooms.map((room) => (
            <li key={room.book_id} onClick={() => handleRoomSelect(room.book_id)}>
              {room.book_title}
            </li>
          ))}
        </ul>
      </div>

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

        <div className="stella_input_outer_container">
          <div className="stella_input_container">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="stella_input"
            />
            <button onClick={handleSendMessage} className="stella_send_button">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stella;
