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
// Number of frames elapsed for song to play 2x
let MAX_SPEED = 60;
// Number of frames elapsed for song to play 0x
let MIN_SPEED = 5;

// Volume for clock
let clockVol = -5;

function preload() {
  hamstar = loadSound('hamstar.mp3');
  clock = loadSound('clock.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Listen for movement data
  socket.on('move', function (data) {
    // If there's slight movement, set
    if (data > 0.5) clockVol = -5;
    // Compare that to this:
    //if (data > 0.5) clockVol -= 0.5;

  });

  // Listen for shake data
  socket.on('shake', function (message) {
    let id = message.id;
    let speed = message.data;
    // Ignore super fast shakes - noisy data
    if(speed > MIN_SPEED) {
      console.log(speed);
      users[id] = speed;
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

  // Generate fake data
  // randomSeed(0);
  // noiseSeed(0);
  // for(let i = 0; i < 16; i++) {
  //   let u = random(100);
  //   users[u] = randomGaussian(MAX_SPEED*0.67, MAX_SPEED);
  //   users[u] = constrain(users[u], MIN_SPEED, MAX_SPEED);
  // }
}

function draw() {
  background(255);

  // Move fake data
  // for(let u in users) {
  //   users[u] += (noise(frameCount*0.01)-0.5)*random(1);
  //   users[u] = constrain(users[u], MIN_SPEED, MAX_SPEED);
  // }

  ////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////
  ////////////////////////// GROUP EFFORT ////////////////////////////
  ////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////

  // Find the mean average speed
  let meanSpeed = 0;
  // Count number of users
  let numUsers = 0;
  for (let u in users) {
    meanSpeed += users[u];
    numUsers++;
  }
  meanSpeed /= numUsers;

  // Find the median average speed
  let maxSpeed = 0;
  let minSpeed = 1000000000;
  for (let u in users) {
    let user = users[u];
    if (user > maxSpeed) maxSpeed = user;
    if (user < minSpeed) minSpeed = user;
  }

  // Calculate the mid-point between the fastest and slowest speeds
  let medianSpeed = (maxSpeed + minSpeed) / 2;

  // Decide which speed will represent the group
  //let speed = meanSpeed || MAX_SPEED;
  let speed = medianSpeed;
  //let speed = maxSpeed;

  // Playback speed of hamstar dance
  // 1 second speed = no playback
  // 0 second speed = 10x playback
  let playSpeed = map(speed, MAX_SPEED, MIN_SPEED, 0, 2);

  // Set playback speed of hamstar dance 3x a second
  if(frameCount%10 == 0) hamstar.rate(max(0.001, playSpeed));


  // Clock increases volume all the time if there are users
  if (numUsers > 0) {
    clockVol += 0.005;
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
  let colW = (width-(2*m)) / numUsers;
  let scl = height/150;
  noStroke();
  for (let u in users) {
    let speed = users[u]*scl;
    ellipse((userNum * colW) + m, speed, 20, 20);
    userNum++;
  }

  noStroke();
  fill(0);
  text("MEAN", m, meanSpeed*scl);
  text("MEDIAN", m, medianSpeed*scl);
  text("MAX", m, maxSpeed*scl);

  stroke(0);
  line(0, meanSpeed*scl, width, meanSpeed*scl);
  line(0, medianSpeed*scl, width, medianSpeed*scl);
  line(0, maxSpeed*scl, width, maxSpeed*scl);


  // Draw clock volume
  let h = map(clockVol, -5, 5, 0, height);
  if (clockVol > 0) fill('green');
  else fill('red');
  noStroke();
  rect(0, height - h, width, h);
}
