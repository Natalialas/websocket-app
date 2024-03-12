const socket = io();

const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

let userName = '';

socket.on('message', ({ author, content }) => addMessage(author, content))

socket.on('newUser', (userName) => {
    addMessage('Chat Bot', userName + ' has joined the conversation!', true);
});

socket.on('userLeft', (userName) => {
    addMessage('Chat Bot', userName + ' has left the conversation... :(', true);
});


function login(event) {
    event.preventDefault();

    const userNameValue = userNameInput.value.trim();

    if (userNameValue === '') {
        alert('Please enter your username.');
        return;
    }

    userName = userNameValue;

    socket.emit('join', userName);
    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
}

loginForm.addEventListener('submit', login);

function sendMessage(e) {
    e.preventDefault();
  
    let messageContent = messageContentInput.value;
  
    if(!messageContent.length) {
      alert('You have to type something!');
    }
    else {
      addMessage(userName, messageContent);
      socket.emit('message', { author: userName, content: messageContent })
      messageContentInput.value = '';
    }
}

addMessageForm.addEventListener('submit', sendMessage);

function addMessage(author, content) {
    const message = document.createElement('li');
    message.classList.add('message');
    message.classList.add('message--received');
    if(author === userName) message.classList.add('message--self');
    if(author === 'Chat Bot') {
        message.classList.add('message--bot');
    }
    message.innerHTML = `
      <h3 class="message__author">${userName === author ? 'You' : author }</h3>
      <div class="message__content">
        ${content}
      </div>
    `;
    messagesList.appendChild(message);
}

userNameInput.setAttribute('autoComplete', 'off');
messageContentInput.setAttribute('autoComplete', 'off');