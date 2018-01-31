// Open and connect input socket
let socket = io('/input');

// Listen for confirmation of connection
socket.on('connect', function () {
  console.log("Connected");
});

// When did user last type?
let lastChange = 0;
// String user is typing
let str = '';

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
}

// Display typing
function draw() {
  background(255);
  textSize(128);
  text(str, width / 2, height / 2);
}

// Only listen for ASCII keys to add to string
function keyTyped() {
  // Capture time of change
  let now = millis();

  // Start over at each new word
  if(key == ' ') {
    str = '';
    socket.emit('next');
    // Record time of latest change
    lastChange = now;
    return;
  }

  // Update string
  str += key;

  // Send key typed and speed
  let message = {
    add: key,
    speed: pow(1/(now - lastChange), .75)
  }
  socket.emit('add', message);

  // Record time of latest change
  lastChange = now;
}

// Listen for DELETE or BACKSPACE to remove last character
function keyPressed() {
  if (keyCode == DELETE || keyCode == BACKSPACE) {
    str = str.slice(0, -1);
    socket.emit('remove');
  }
}
