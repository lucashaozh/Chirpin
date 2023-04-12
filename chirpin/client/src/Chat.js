import React, { useState, useRef, useEffect } from 'react';
import "./css/Chatbox.css";
import { faPaperclip, faSmile, faPaperPlane, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { getLoginInfo, login } from './Login';

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
                          <div class="d-flex align-items-start">
                            <div class="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">

                              <button class="nav-link active" id="v-pills-home-tab" data-bs-toggle="pill" data-bs-target="#v-pills-home" type="button" role="tab" aria-controls="v-pills-home" aria-selected="true">
                                <a href="#!" class="d-flex justify-content-between" >
                                  <div class="d-flex flex-row">
                                    <div>
                                      <img
                                        src={[require('./img/femaleAvatar.png')]}
                                        alt="avatar" class="d-flex align-self-center me-3" width="60" />
                                      <span class="badge bg-success badge-dot"></span>
                                    </div>
                                    <div class="pt-1" >
                                      <p class="small text-muted" style={{color:'white'}}>Ziqi</p>
                                    </div>
                                  </div>

                                </a>
                              </button>
                              
                              
                            </div>
                            <div class="tab-content" id="v-pills-tabContent">
                              <div class="tab-pane fade show active" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab" tabindex="0">
                              <div className="chat-box">
                                  <div className="chat-body" ref={messageContainerRef}>
                                    {getLoginInfo()['username']=='Ziqi'&& <button style={{ backgroundColor: "green", color: "white", fontSize: "17px", borderRadius: "4px", border: "white" }} >test</button>}
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
                                    <FontAwesomeIcon icon={faPaperPlane}></FontAwesomeIcon>
                                    </button>
                                    </div>
                              </div>
                              </div>


                              <div class="tab-pane fade" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab" tabindex="0">
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
                                    <FontAwesomeIcon icon={faPaperPlane}></FontAwesomeIcon>
                                    </button>
                                    </div>
                              </div>
                              </div>


                              <div class="tab-pane fade" id="v-pills-messages" role="tabpanel" aria-labelledby="v-pills-messages-tab" tabindex="0">
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
                                    <FontAwesomeIcon icon={faPaperPlane}></FontAwesomeIcon>
                                    </button>
                                    </div>
                              </div>
                              </div>


                              <div class="tab-pane fade" id="v-pills-settings" role="tabpanel" aria-labelledby="v-pills-settings-tab" tabindex="0">
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
                                    <FontAwesomeIcon icon={faPaperPlane}></FontAwesomeIcon>
                                    </button>
                                    </div>
                              </div>
                              </div>
                            </div>
                          </div>

                        </li>
                      </ul>
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