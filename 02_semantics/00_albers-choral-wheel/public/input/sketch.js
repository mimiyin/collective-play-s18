// Open and connect input socket
let socket = io('/input');

// Listen for confirmation of connection
socket.on('connect', function() {
  console.log("Connected");
});

// AudioIn object
let mic;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER);

  // Fire up the mic
  mic = new p5.AudioIn()
  mic.start();
}

function draw(){
  background(0);

  // Get mic level
  let level = mic.getLevel();

  // Scale y-position of circle to mic level
  fill(255);
  ellipse(width/2, height-(level*height*2), 50, 50);

  // Display mic level onscreen
  textSize(32);
  text(nfs(level, 1, 2), width/2, height/2);

  // Send level to server
  socket.emit('data', level);
}



