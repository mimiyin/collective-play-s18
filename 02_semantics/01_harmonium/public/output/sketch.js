// Open and connect input socket
let socket = io('/output');

// Listen for confirmation of connection
socket.on('connect', function () {
  console.log("Connected");
});

// Keep track of users
let users = {};
// Length of diag of screen
let diag = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  strokeCap(PROJECT);

  // Calculate diag of screen
  diag = sqrt(sq(width) + sq(height));

  // Listen for pitch change from server
  socket.on('message', function (message) {
    //console.log(message);
    let id = message.id;
    let rot = message.data;

    // Map note frequency to rotation data
    let freq = map(rot, 0, 360, base, 2 * base);

    // New user
    if (!(id in users)) {
      users[id] = {
        rot: undefined,
        note: new p5.Oscillator(),
        amp : 0
      }

      // Create a triangle wave
      users[id].note.setType('triangle');
      users[id].note.start();
    }
    // If there's been no movement, fade in
    else if (abs(users[id].rot - rot) < 1) {
      users[id].amp += 0.001;
      users[id].amp = constrain(users[id].amp, 0, 5);
      users[id].note.amp(users[id].amp);
    }
    // Otherwise, fade out if you're moving fast
    else {
      users[id].amp-=0.5;
    }

    // Update rotationZ
    users[id].rot = rot;
    // Update note
    users[id].note.freq(freq);
  });

  // Remove disconnected users
  socket.on('disconnected', function (id) {
    // Turn off note before deleting user
    users[id].note.amp(0);
    delete users[id];
  });
}

function draw() {

  // Draw Scale
  background(0);

  translate(width / 2, height / 2);
  stroke(255, 32);
  for (let r = 0; r < ratios.length; r++) {
    let ratio = ratios[r];
    let dir = map((ratio.num / ratio.den), 1, 2, -90, 270);
    strokeWeight(25 - (ratio.num + ratio.den));
    push();
    rotate(dir);
    line(0, 0, diag / 2, 0);
    pop();
  }

  // Draw everybody
  strokeWeight(1);
  for (let id in users) {
    let dir = users[id].rot - 90;
    push();
    rotate(dir);
    if (id == socket.id) stroke('red')
    else stroke(255);
    line(0, 0, diag / 2, 0);
    pop();
  }

  stroke('green');
  strokeWeight(10);
  let mouse = createVector((width / 2 - mouseX), (height / 2 - mouseY));
  let heading = mouse.heading();
  dir = map(heading, -270, 90, 0, 360);
  dir %= 360;

  let mag = mouse.mag();

  // Draw line
  push();
  rotate(dir-90);
  line(0, 0, mag, 0);
  pop();

  // Draw my stats
  strokeWeight(1);
  push();
  fill(255);
  noStroke();
  rect(0, 0, 50, 50);
  fill(0);
  text(nfs(dir, 1, 2), 0, 0);
  pop();

  // Send conductor data
  socket.emit('conductor', dir);
}