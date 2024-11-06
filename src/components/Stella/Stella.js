import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { WEBSOCKET_CHAT_URL, API_CHAT_URL } from '../../util/apiUrl';
import './Stella.css';

const Stella = () => {
  const { bookId } = useParams();
  const location = useLocation();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  // 스크롤을 관리할 ref 추가
  const chatBoxRef = useRef(null);

  const queryParams = new URLSearchParams(location.search);
  const memberNum = queryParams.get('memberNum');

  useEffect(() => {
    if (memberNum && bookId) {
      const loadChatHistory = async () => {
        try {
          const response = await axios.get(`${API_CHAT_URL}/${bookId}/${memberNum}`);
          setChatHistory(response.data);
        } catch (error) {
          console.error('Failed to load chat history:', error);
        }
      };

      loadChatHistory();

      const ws = new WebSocket(`${WEBSOCKET_CHAT_URL}?book_id=${bookId}&member_num=${memberNum}`);
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
    }
  }, [memberNum, bookId]);

  // 새로운 메시지가 추가될 때마다 스크롤을 하단으로 이동
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = () => {
    if (socket && message.trim()) {
      const userMessage = { sender_id: 'user', message: message.trim() };
      socket.send(message.trim());
      setChatHistory((prev) => [...prev, userMessage]);
      setMessage('');
      setIsTyping(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="stella_container">
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
  );
};

export default Stella;
