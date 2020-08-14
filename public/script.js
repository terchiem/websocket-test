const socket = io.connect('http://localhost:3000');




const box = document.querySelector('.box');
box.addEventListener('click', handleClick);

function handleClick(e) {
  const data = {
    x: e.x,
    y: e.y
  }
  socket.emit('click', data);
  console.log('click!');
}

const messages = document.querySelector('.messages');

function addMessage(string) {
  console.log('click received from server')
  const message = document.createElement('li');
  message.innerText = string;
  messages.appendChild(message);
}

socket.on('clicked', addMessage);
