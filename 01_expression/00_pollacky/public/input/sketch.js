// Open and connect input socket
let socket = io('/input');

// Listen for confirmation of connection
socket.on('connect', function() {
  console.log("Connected");
});

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER);
}

function draw(){
  background(255);
  noStroke();
  fill(0);

  // Calcaulate transparency of left-right
  // and up-down halves based on tilt of device
  // RotationXY gives you numbers from -180 to 180.
  let lr = floor(rotationY);
  let tb = floor(rotationX);
  // Ignore flipped over device
  lr = constrain(lr, -90, 90);
  tb = constrain(tb, -90, 90);

  // Map rotation to alpha range
  let lra = map(lr, -90, 90, 255, 0)
  let tba = map(tb, -90, 90, 255, 0)


  // Transparency reflects degree of tilt
  // Left Half
  fill(0, lra);
  rect(0, 0, width/2, height);
  // Right Half
  fill(0, 255-lra);
  rect(width/2, 0, width/2, height);
  // Top Half
  fill(0, tba);
  rect(0, 0, width, height/2);
  // Bottom Half
  fill(0, 255-tba);
  rect(0, height/2, width, height);

  // Send tilt angle
  socket.emit('tilt', {x: lr, y: tb});
}

// Calculate size of shake
// Send data
function deviceShaken() {
  let blopSz = abs(accelerationX-pAccelerationX) + abs(accelerationY-pAccelerationY);
  socket.emit('shake', blopSz);
}



