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
  socket.emit('data', {x: mouseX/width, y: mouseY/height});

  // Send mouse position - maintain aspect ratio
  //socket.emit('data', {x: mouseX/width, y: mouseY/width});

}

// Callback to draw position when new position is received
function drawPos(pos) {
  fill(0);
  // Scale position to screen
  ellipse(pos.x*width, pos.y*height, 10, 10);

  // Scale position - maintain aspect ratio
  //ellipse(pos.x*width, pos.y*width, 10, 10);
}


