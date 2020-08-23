const socket = io.connect('http://localhost:3000');

const userName = prompt("Enter user name");

socket.emit('join', { userName });

const chatText = document.getElementById('chatText');
const chatForm = document.getElementById('chat');
chatForm.addEventListener('submit', handleSubmit);

function handleSubmit(e) {
  e.preventDefault();
  socket.emit('client message', { data: chatText.value });
  chatText.value = '';
}

const messages = document.querySelector('.messages');
const userList = document.querySelector('.user-list');

// socket events
socket.on('user list', createUserList);
socket.on('server message', addMessage);
socket.on('update user list', updateUserList);
socket.on('remove user', removeUser);

// socket event functions
function createUserList(users) {
  for (let user of users) {
    updateUserList(user);
  }
}

function updateUserList(userName) {
  const user = document.createElement('li');
  user.innerText = userName;
  userList.appendChild(user);
}

function addMessage(string) {
  const message = document.createElement('li');
  message.innerText = string;
  messages.appendChild(message);
}

function removeUser(userName) {
  const userNodes = userList.childNodes;
  for (let user of userNodes) {
    if (user.innerText === userName) {
      userList.removeChild(user);
      break;
    }
  }
}