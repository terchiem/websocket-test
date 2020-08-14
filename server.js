const express = require('express');
const socket = require('socket.io');

// initialize express server
const app = express();
const server = app.listen(3000, () => {
  console.log('Server started on port 3000');
});

// serve public folder files
app.use(express.static('public'));

// establish socket
const io = socket(server);
io.sockets.on('connection', newConnection);

function newConnection(socket) {
  console.log('new connection: ', socket.id);

  socket.on('click', clickMsg);
  function clickMsg(data) {
    console.log('click from: ', socket.id);
    const msg = `${socket.id} clicked at: ${data.x}, ${data.y}`
    // socket.broadcast.emit('clicked', msg);
    io.sockets.emit('clicked', msg);
  }
}
