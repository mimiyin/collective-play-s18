// Create server
let port = process.env.PORT || 8000;
let express = require('express');
let app = express();
let server = require('http').createServer(app).listen(port, function () {
  console.log('Server listening at port: ', port);
});

// Tell server where to look for files
app.use(express.static('public'));

// Create socket connection
let io = require('socket.io').listen(server);

// Listen for individual clients to connect
io.sockets.on('connection',
  // Callback function on connection
  // Comes back with a socket object
  function (socket) {

    console.log("We have a new client: " + socket.id);

    // Listen for username
    // Stick the username on the socket object
    socket.on('username', function (username) {
      socket.username = username;
      console.log(username);
    });

    // Listen for data from this client
    socket.on('data', function (data) {
      // Data can be numbers, strings, objects
      //console.log("Received: 'data' " + data);

      // Send message with username
      let message = {
        username: socket.username || '',
        data: data
      }

      // Send it to all of the clients, including this one
      io.sockets.emit('message', message);
    });

    // Listen for this client to disconnect
    socket.on('disconnect', function () {
      console.log("Client has disconnected " + socket.id);
    });
  }
);