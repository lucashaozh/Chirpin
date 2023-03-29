import React, { useState, useRef, useEffect } from 'react';
import "./css/Chatbox.css";

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const messageContainerRef = useRef(null);

  useEffect(() => {
    messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
  }, [messages]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSendButtonClick = () => {
    if (inputValue === '') {
      return;
    }
    const newMessage = {
      id: Date.now(),
      text: inputValue,
      sent: true,
    };
    setMessages((messages) => [...messages, newMessage]);
    setInputValue('');
  };

  const handleInputKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendButtonClick();
    }
  };

  const handleWithdrawButtonClick = (messageId) => {
    setMessages((messages) =>
      messages.filter((message) => message.id !== messageId)
    );
  };

  return (
    <div className="chat-box">
      <div className="chat-header">
        <h3>Chat</h3>
        <button className="close-button">&times;</button>
      </div>
      <div className="chat-body" ref={messageContainerRef}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sent ? 'sent' : ''}`}
          >
            {message.text}
            {message.sent && (
              <button
                className="withdraw-button"
                onClick={() => handleWithdrawButtonClick(message.id)}
              >
                ❌
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="chat-footer">
        <input
          type="text"
          className="message-input"
          placeholder="Type your message..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleInputKeyPress}
        />
        <button className="send-button" onClick={handleSendButtonClick}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBox;