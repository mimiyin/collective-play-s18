// Open and connect input socket
let socket = io('/input');

// Listen for confirmation of connection
socket.on('connect', function() {
  console.log("Connected");
});

function setup(){
  createCanvas(windowWidth, windowHeight);
  background(255);

  // Select input and listen for changes
  select("#username").input(usernameChanged);
}

function mouseMoved(){
  // Send mouse position as a percentage of screen width and height
  socket.emit('data', {x: mouseX/width, y: mouseY/height});

  // Send mouse position as a percentage of screen width and height
  // While also maintaining the aspect ratio
  //socket.emit('data', {x: mouseX/width, y: mouseY/width});

  // Draw ellipse @mouse position
  fill(0);
  ellipse(mouseX, mouseY, 10, 10);
}

function usernameChanged(){
  socket.emit('username', this.value());
}


