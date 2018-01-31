// Open and connect input socket
let socket = io('/input');

// Listen for confirmation of connection
socket.on('connect', function () {
  console.log("Connected");
});

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  rectMode(CENTER);

  // Using WEB API for touchstart because p5 Touch objects don't include force
  // https://developer.mozilla.org/en-US/docs/Web/API/Touch/force
  var el = document.getElementsByTagName("canvas")[0];
  // Listen for touchstart events on the canvas
  el.addEventListener("touchstart", handleStart, false);
}

function draw() {
  // Draw a background every 10 frames
  if(frameCount%10 == 0) background(0);
}

function handleStart(e) {
  // Get array of touches
  let touches = e.touches;
  // Add up force of each finger
  let force = 0;
  for(let t = 0; t < touches.length; t++) {
    force += touches[t].force;
  }
  // Send total force to server
  socket.emit('data', force);

  // Draw a red rectangle when there's a beat
  // Size scaled to force
  let sz = force*5*width;
  fill('red');
  rect(width/2, height/2, sz, sz);
}