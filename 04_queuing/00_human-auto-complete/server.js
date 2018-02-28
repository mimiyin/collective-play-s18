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

// Keep track of queue
let queue = [];
let q = -1;
let current;

// Listen for individual clients to connect
io.sockets.on('connection',
  // Callback function on connection
  // Comes back with a socket object
  function (socket) {

    console.log("We have a new client: " + socket.id);

    // Add socket to queue
    queue.push(socket);

    // Kick off queue as soon as there's 1 person in line
    if (q < 0 && queue.length > 1) {
      next();
    }
    // Listen for add messages
    socket.on('add', function (data) {
      // Data comes in as whatever was sent, including objects
      //console.log("Received: 'message' " + data);

      // Send it to all clients, including this one
      io.sockets.emit('add', data);
    });

    // Listen for remove messages
    socket.on('remove', function (data) {
      // Data comes in as whatever was sent, including objects
      //console.log("Received: 'message' " + data);

      // Send it to all clients, including this one
      io.sockets.emit('remove', data);
    });

    // Ready for next
    socket.on('next', function () {
      next();
    });                                                                                         

    // Listen for this client to disconnect
    // Tell everyone client has disconnected
    socket.on('disconnect', function() {
      io.sockets.emit('disconnected', socket.id);
      // Remove socket from queue
      for(let s = 0; s < queue.length; s++) {
        if(queue[s].id == socket.id) {
          queue.splice(s, 1);
        }
      }
      // If current client disconnected, move onto next client
      if (socket === current) {
        next();
      }
    });
  });

// Get next client
function next() {
  // Move to next person in line
  q++;
  q %= queue.length;
  console.log("NEXT UP: ", q);

  current = queue[q];
  current.emit('go');
}