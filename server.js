const express = require('express');
const socket = require('socket.io');

// initialize express server
const app = express();
const server = app.listen(4000, () => {
  console.log('Server started on port 4000');
});

// TEMP: Replace with routes to connect to front end
app.use(express.static('public'));

// establish socket
const io = socket(server);
io.sockets.on('connect', newConnection);

// chat users mapped as:
// [socket.id]: userName
const users = {};

/** Handle socket connections */
function newConnection(socket) {
  console.log('new connection: ', socket.id);

  // send out all current users connected
  socket.emit('user list', Object.values(users));

  /**
   * Handle user name when connecting
   * - add the user name to the users object
   * - send a chat message to announce the join
   * - send the user name to update everyone's user list
   */
  socket.on('join', nameUser);
  function nameUser({ userName }) {
    users[socket.id] = userName;
    io.sockets.emit('server message', `${userName} joined the chat.`);
    io.sockets.emit('update user list', userName);
  }

  /**
   * Handle receiving and sending of messages
   * - server receives message from client
   * - server broadcasts message to all clients to update client chat bpx
   */
  socket.on('client message', chatMsg);
  function chatMsg({ data }) {
    const msg = `${users[socket.id]}: ${data}`;
    io.sockets.emit('server message', msg);
  }

  /**
   * Handle disconnecting
   * - send a chat message to announce leaving
   * - send the user name to be removed from everyone's user list
   * - remove user/socket id from users object
   */
  socket.on('disconnect', handleDisconnect);
  function handleDisconnect() {
    console.log('disconnected: ', socket.id);
    const userName = users[socket.id];
    io.sockets.emit('server message', `${userName} left the chat.`);
    io.sockets.emit('remove user', userName);
    delete users[socket.id];
  }
}
