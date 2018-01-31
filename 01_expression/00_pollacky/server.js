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

// Clients in the output namespace
var outputs = io.of('/output');
// Listen for output clients to connect
outputs.on('connection', function(socket){
  console.log('An output client connected: ' + socket.id);

  // Listen for this output client to disconnect
  socket.on('disconnect', function() {
    console.log("An output client has disconnected " + socket.id);
  });
});

// Clients in the input namespace
var inputs = io.of('/input');
// Listen for input clients to connect
inputs.on('connection', function(socket){
  console.log('An input client connected: ' + socket.id);

  // Listen for tilt data
  socket.on('tilt', function(data) {
    // Data comes in as whatever was sent, including objects
    //console.log("Received: 'message' " + data);

    let message = {
      id: socket.id,
      data : data
    }

    // Send it to all of the output clients
    outputs.emit('tilt', message);
  });

  // Listen for blop data
  socket.on('shake', function(data) {
    // Data comes in as whatever was sent, including objects
    //console.log("Received: 'message' " + data);

    let message = {
      id: socket.id,
      data : data
    }

    // Send it to all of the output clients
    outputs.emit('shake', message);
  });

  // Listen for this input client to disconnect
  // Tell all of the output clients this client disconnected
  socket.on('disconnect', function() {
    console.log("An input client has disconnected " + socket.id);
    outputs.emit('disconnected', socket.id);
  });
});
