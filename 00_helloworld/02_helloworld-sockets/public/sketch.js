// Open and connect socket
let socket = io();

function setup(){
  createCanvas(windowWidth, windowHeight);
  background(255);

  // Listen for confirmation of connection
  socket.on('connect', function() {
    console.log("Connected");
  });

  // Receive message from server
  socket.on('data', drawPos);
}

function mouseMoved() {
  // Send mouse position
  socket.emit('data', {x: mouseX, y: mouseY});

  // Draw yourself? or Wait for server?
  // fill(0);
  // ellipse(mouseX, mouseY 10, 10);
}

// Callback to draw position when new position is received
function drawPos(pos) {
  fill(0);
  ellipse(pos.x, pos.y, 10, 10);
}


