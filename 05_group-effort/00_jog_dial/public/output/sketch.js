// Open and connect input socket
let socket = io('/output');

// Listen for confirmation of connection
socket.on('connect', function () {
  console.log("Connected");
});

// Keep track of users
let users = {};
// Sounds
let hamstar, clock;

// Min number of users
let MIN_USERS = 1;

// Number of frames elapsed for song to play 2x
let MIN_INTERVAL = 5;
// Number of frames elapsed for song to play 0x
let MAX_INTERVAL = 60;

// Volume for clock
let clockVol = -5;
let CLOCK_SENSITIVITY = 0.25;
let CLOCK_VOL_SPEED = 0.005;

function preload() {
  hamstar = loadSound('hamstar.mp3');
  clock = loadSound('clock.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Listen for movement data
  socket.on('move', function (data) {
    // If there's slight movement, set
    if (data > CLOCK_SENSITIVITY) clockVol = -5;
    // Compare that to this:
    //if (data > 0.5) clockVol -= 0.5;

  });

  // Listen for shake data
  socket.on('shake', function (message) {
    let id = message.id;
    let interval = message.data;
    // Ignore super fast shakes - noisy data
    if(interval > MIN_INTERVAL) {
      console.log(interval);
      users[id] = interval;
    }
  });

  // Listen for disconnection to remove user
  socket.on('disconnected', function (id) {
    delete users[id];
  });

  // Set up sounds
  hamstar.rate(0);
  hamstar.loop();
  clock.loop();
  clock.setVolume(0);

  // Peg frameRate to 30
  frameRate(30);
}

function draw() {
  background(255);

  ////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////
  ////////////////////////// GROUP EFFORT ////////////////////////////
  ////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////

  // Find the mean average interval
  let meanInterval = 0;
  // Count number of users
  let numUsers = 0;
  for (let u in users) {
    meanInterval += users[u];
    numUsers++;
  }
  meanInterval /= MIN_USERS;

  // Find the median average interval
  let maxInterval = 0;
  let minInterval = 1000000000;
  for (let u in users) {
    let interval = users[u];
    if (interval < minInterval) minInterval = interval;
    if (interval > maxInterval) maxInterval = interval;
  }

  // Calculate the mid-point between the smallest and largest interval
  let medianInterval = (maxInterval + minInterval) / 2;

  // Decide which interval will represent the group
  //let interval = meanInterval || MAX_INTERVAL;
  let interval = medianInterval;
  //let interval = maxInterval;

  // Playback speed of hamstar dance
  // 1 second interval = no playback
  // 0 second interval = 2x playback
  let playSpeed = map(interval, MIN_INTERVAL, MAX_INTERVAL, 2, 0);
  playSpeed = constrain(playSpeed, 0, 2);

  // Set playback speed of hamstar dance - don't let it actually fall to 0
  if(frameCount%10 == 0) hamstar.rate(max(0.001, playSpeed));


  // Clock increases volume all the time if there are users
  if (numUsers >= MIN_USERS) {
    clockVol += CLOCK_VOL_SPEED;
    clock.setVolume(constrain(clockVol, 0, 5));
  }

  ////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////
  //////////////// Draw the users and averages ///////////////////////
  ////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////

  let userNum = 0;
  let m = 100;
  let colW = (width-(2*m)) / MIN_USERS;
  let scl = height/150;
  noStroke();
  for (let u in users) {
    let interval = users[u]*scl;
    ellipse((userNum * colW) + m, interval, 20, 20);
    userNum++;
  }

  noStroke();
  fill(0);
  text("MEAN", m, meanInterval*scl);
  text("MEDIAN", m, medianInterval*scl);
  text("MIN", m, maxInterval*scl);

  stroke(0);
  line(0, meanInterval*scl, width, meanInterval*scl);
  line(0, medianInterval*scl, width, medianInterval*scl);
  line(0, maxInterval*scl, width, maxInterval*scl);


  // Draw clock volume
  let h = map(clockVol, -5, 5, 0, height);
  if (clockVol > 0) fill('green');
  else fill('red');
  noStroke();
  rect(0, height - h, width, h);
}
