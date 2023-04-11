import React, { useState, useRef, useEffect } from 'react';
import "./css/Chatbox.css";
import { faPaperclip, faSmile, faPaperPlane, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
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
    <div class="container py-5">

      <div class="row">
        <div class="col-md-12">

          <div class="card" id="chat3" style={{borderRadius: "15px"}}>
            <div class="card-body">

              <div class="row">
                <div class="col-md-6 col-lg-5 col-xl-4 mb-4 mb-md-0">

                  <div class="p-3">

                    <div class="input-group rounded mb-3">
                      <input type="search" class="form-control rounded" placeholder="Search" aria-label="Search"
                        aria-describedby="search-addon" />
                      <button type="button" class="btn btn-light btn-lg btn-rounded float-end"><FontAwesomeIcon icon={faSearch}></FontAwesomeIcon></button>

                    </div>

                    <div data-mdb-perfect-scrollbar="true" style={{position: "relative", height: "400px"}}>
                      <ul class="list-unstyled mb-0">
                        <li class="p-2 border-bottom">

                          <a href="#!" class="d-flex justify-content-between" >
                            <div class="d-flex flex-row">
                              <div>
                                <img
                                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                  alt="avatar" class="d-flex align-self-center me-3" width="60" />
                                <span class="badge bg-success badge-dot"></span>
                              </div>
                              <div class="pt-1" >
                                <p class="fw-bold mb-0">user_02</p>
                                <p class="small text-muted">Hello, Are you there?</p>
                              </div>
                            </div>
                            <div class="pt-1">
                              <p class="small text-muted mb-1">Just now</p>
                            </div>
                          </a>
                          
                          <a href="#!" class="d-flex justify-content-between">
                            <div class="d-flex flex-row">
                              <div>
                                <img
                                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                  alt="avatar" class="d-flex align-self-center me-3" width="60" />
                                <span class="badge bg-success badge-dot"></span>
                              </div>
                              <div class="pt-1">
                                <p class="fw-bold mb-0">user_03</p>
                                <p class="small text-muted">Hello, Are you there?</p>
                              </div>
                            </div>
                            <div class="pt-1">
                              <p class="small text-muted mb-1">Just now</p>
                            </div>
                          </a>

                          <a href="#!" class="d-flex justify-content-between">
                            <div class="d-flex flex-row">
                              <div>
                                <img
                                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                  alt="avatar" class="d-flex align-self-center me-3" width="60" />
                                <span class="badge bg-success badge-dot"></span>
                              </div>
                              <div class="pt-1">
                                <p class="fw-bold mb-0">user_04</p>
                                <p class="small text-muted">Hello, Are you there?</p>
                              </div>
                            </div>
                            <div class="pt-1">
                              <p class="small text-muted mb-1">Just now</p>
                            </div>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>

                </div>

                <div class="col-md-6 col-lg-7 col-xl-8">

                  <div className="chat-box">
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

                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
 
export default ChatBox;









{/* 
114514 
*/}