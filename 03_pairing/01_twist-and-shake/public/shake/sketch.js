// Open and connect input socket
let socket = io('/input');

// Listen for confirmation of connection
socket.on('connect', function () {
  console.log("Connected");
});

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  setShakeThreshold(10);
}

function draw(){
  if(frameCount%10 == 0) background(0);
}

// Calculate size of shake
// Send data
function deviceShaken() {
  let force = abs(accelerationX-pAccelerationX) + abs(accelerationY-pAccelerationY);
  fill('red');
  rect(width/2, height/2, force, force);
  socket.emit('shake', force);
}


