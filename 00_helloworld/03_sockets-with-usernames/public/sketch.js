// Open and connect socket
let socket = io();

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);

  // Select input and listen for changes
  select("#username").input(usernameChanged);

  // Listen for confirmation of connection
  socket.on('connect', function () {
    console.log("Connected");
  });

  // Receive message from server
  socket.on('message', function (message) {
    console.log(message);
    let username = message.username;
    let pos = message.data;

    drawPos(username, pos);
  });
}

// Draw position when new position is received
function drawPos(username, pos) {
  fill(0);
  push();
  translate(pos.x, pos.y);
  text(username, 10, 0);
  ellipse(0, 0, 10, 10);
  pop();
}

// Send mouse position only when mouse moves
function mouseMoved(){
  socket.emit('data', {x: mouseX, y: mouseY});
}

// Send new username as it changes
function usernameChanged(){
  socket.emit('username', this.value());
}



