// Open and connect input socket
let socket = io('/input');

// Listen for confirmation of connection
socket.on('connect', function () {
  console.log("Connected");
});

// Keep track of users
let users = {};
// Heading of conductor
let conductor = 0;
// Your note
let note;
// Volume of note
let amp = 0;
// Length of diag of screen
let diag = 0;

// Load sound sample for playing note
// This is a hack because iOS WebKit
// doesn't support oscillators
function preload() {
  note = loadSound('triangle.wav');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  strokeCap(PROJECT);

  // Calculate length of diagonal of screen
  diag = sqrt(sq(width) + sq(height));

  // Listen for pitch change
  socket.on('message', function (message) {
    //console.log(message);
    let id = message.id;
    users[id] = message.data;
  });

  // Listen for conductor
  socket.on('conductor', function(data){
    conductor = data;
  });

  // Remove disconnected users
  socket.on('disconnected', function(id){
    delete users[id];
  });

  // Loop note, mute
  note.loop();
  note.setVolume(0);
}

function draw() {

  // Draw Scale
  background(0);

  // Draw from the center
  translate(width / 2, height / 2);

  // Draw all the notes in the diatonic scale
  stroke(255, 32);
  for (let r = 0; r < ratios.length; r++) {
    let ratio = ratios[r];
    let angle = map((ratio.num / ratio.den), 1, 2, -90, 270);
    strokeWeight(25 - (ratio.num + ratio.den));
    push();
    rotate(angle);
    line(0, 0, diag / 2, 0);
    pop();
  }

  // Draw conductor
  push();
  rotate(conductor-90);
  strokeWeight(10);
  stroke('green');
  line(0, 0, diag/2, 0);
  pop();


  // Draw everybody
  strokeWeight(1);
  for (let id in users) {
    let angle = users[id]-90;
    push();
    rotate(angle);
    // Draw me
    if (id == socket.id) stroke('red')
    else stroke(255);
    line(0, 0, diag / 2, 0);
    pop();
  }

  // Draw my stats
  strokeWeight(1);
  push();
  rotate(rotationZ);
  fill(255);
  noStroke();
  rect(0, 0, 50, 50);
  fill(0);
  text(nfs(rotationZ, 1, 2), 0, 0);
  pop();

  // Play my note with a soundfile
  // Scale rotationZ to frequency of note
  if (abs(rotationZ - pRotationZ) < 1) {
    let freq = map(rotationZ, 0, 360, 1, 2);
    note.rate(freq);
    note.setVolume(amp);
    amp += 0.001;
    amp = constrain(amp, 0, 5);
    note.setVolume(amp);
  }
  // Otherwise, fade out if you're moving fast
  else {
    amp-=0.5;
  }

  // Send my pitch data
  socket.emit('data', rotationZ);
}
