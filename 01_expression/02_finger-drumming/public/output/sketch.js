// Open and connect output socket
let socket = io('/output');

// Listen for confirmation of connection
socket.on('connect', function() {
  console.log("Connected");
});

// Decide how many users you're going to allow on
let NUM_USERS = 3;
// Keep track of users
let users = {};
// User index
let i = 0;

// Sound samples
let samples = [];

// Create new user object
function createNewUser(id) {
  // Don't create more than NUM_USERS
  if(i > NUM_USERS) return;

  // Create user object to track:
  // Whether user has a beat
  // Force of beat
  // Sample file
  // Y-position screen
  users[id] = {
    beat: false,
    force: 0,
    sample: samples[i],
    y: i*height/samples.length
  }
  i++;
}

// Preload 1 sound file per user
function preload() {
  for (let i = 0; i < NUM_USERS; i++) {
    samples.push(loadSound('samples/' + 2 + '.wav'));
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);

  // Listen for message from server
  socket.on('message', function (message) {

    //console.log(message);
    let id = message.id;
    let force = message.data;

    // New user
    if (!(id in users)) {
      createNewUser(id);
    }
    // Set user's beat attribute to true
    users[id].beat = true;
    // Record force of beat
    users[id].force = force;
  });

  // Remove disconnected users
  socket.on('disconnected', function(id){
    delete users[id];
  });
}

// Visualize beats over time
// by moving across the screen
let x = 0;
function draw() {

  // Wrap around and erase screen
  if (x > width) {
    background(255);
    x = 0;
  }

  // Play beats for each user
  stroke(0, 200);
  fill(0, 200);
  for (let id in users) {
    let user = users[id];
    let beat = user.beat;
    let force = user.force;
    let sample = user.sample;
    let y = user.y;
    // Did user just play a beat?
    if(beat) {
      // Scale volume of beat to force of drumming
      // Non-linear mapping of force --> volume
      // Google x^3 to see graph
      let vol = pow(force, 3);
      vol = max(0, vol);
      text('f:' + nfs(force, 0, 3), x, y+100);
      text('v:' + nfs(vol, 0, 3), x, y+120);

      // Play sample
      sample.play();
      // Set volume after play or it will be buggy!
      sample.setVolume(vol);

      // Draw a rect to present force of beat
      rect(x, y, force*10, 20);

      // After beat has been played,
      // Set beat to false
      user.beat = false;
    }
  }

  // Move over 2 pixels for next beat
  x+=2;
}