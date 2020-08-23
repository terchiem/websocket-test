const express = require('express');
const socket = require('socket.io');

// initialize express server
const app = express();
const server = app.listen(3000, () => {
  console.log('Server started on port 3000');
});

// TEMP: Replace with routes to connect to front end
app.use(express.static('public'));

// establish socket
const io = socket(server);
io.sockets.on('connect', newConnection);

// chat users
const users = {};

function newConnection(socket) {
  console.log('new connection: ', socket.id);

  // send out all current users
  socket.emit('user list', Object.values(users));

  // handle username on join
  socket.on('join', nameUser);
  function nameUser({ userName }) {
    users[socket.id] = userName;
    io.sockets.emit('server message', `${userName} joined the chat.`);
    io.sockets.emit('update user list', userName);
  }

  // handle sending of messages
  socket.on('client message', chatMsg);
  function chatMsg({ data }) {
    const msg = `${users[socket.id]}: ${data}`;
    io.sockets.emit('server message', msg);
  }

  // handle disconnect
  socket.on('disconnect', handleDisconnect);
  function handleDisconnect() {
    console.log('disconnected: ', socket.id);
    const userName = users[socket.id];
    io.sockets.emit('server message', `${userName} left the chat.`);
    io.sockets.emit('remove user', userName);
    delete users[socket.id];
  }
}

