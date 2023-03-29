import React from 'react';
import TweetListView from './Tweet';
import UserListView from './User';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import "./css/Chatbox.css"

const chatBox = document.querySelector('.chat-box');
const closeButton = document.querySelector('.close-button');
const messageContainer = document.querySelector('.message-container');
const messageInput = document.querySelector('.message-input');
const sendButton = document.querySelector('.send-button');

closeButton.addEventListener('click', () => {
  chatBox.style.display = 'none';
});

sendButton.addEventListener('click', sendMessage);

messageInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

function sendMessage() {
  const message = messageInput.value;
  if (message === '') {
    return;
  }
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.textContent = message;
  messageContainer.appendChild(messageElement);
  messageInput.value = '';
  messageInput.focus();
  messageContainer.scrollTop = messageContainer.scrollHeight;
  messageElement.classList.add('sent');
}


function chat(){
    return(
        <>
        <div class="chat-box">
        <div class="chat-header">
            <h3>Chat</h3>
            <span class="close-button">&times;</span>
        </div>
        <div class="chat-body">
            <div class="message-container"></div>
        </div>
        <div class="chat-footer">
            <input type="text" class="message-input" placeholder="Type your message...">
            </input>
            <button class="send-button">Send</button>
        </div>
        </div>
        </>
    )
}

export default chat;