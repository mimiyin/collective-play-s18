// Open and connect output socket
let socket = io('/output');

// Listen for confirmation of connection
socket.on('connect', function() {
  console.log("Connected");
});

// Keep track of users
let users = {};

// Create new user in the middle
function createNewUser(id) {
  users[id] = {
    pos: { x : width/2, y : height/2 },
    ppos: { x : width/2, y : height/2 }
    // pos: createVector(width/2, height/2), //{ x : width/2, y : height/2 },
    // ppos: createVector(width/2, height/2), //{ x : width/2, y : height/2 }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);

  // Listen for drip data from server
  socket.on('tilt', function (message) {
    //console.log(message);
    let id = message.id;
    let data = message.data;

    let vel = { x: data.x/10, y: data.y/10 };

    // Create new user
    if (!(id in users)) {
      createNewUser(id);
    }

    // Update user data
    // Angle of tilt --> speed of drip
    let user = users[id];
    // Current position becomes previous position
    user.ppos.x = user.pos.x;
    user.ppos.y = user.pos.y;
    // Add velocity to current position to get new position
    user.pos.x += vel.x;
    user.pos.y += vel.y;
    // Calculate speed of velocity
    user.speed = dist(user.ppos.x, user.ppos.y, user.pos.x, user.pos.y);

    // Draw a line
    drip(user.ppos, user.pos, user.speed);

  });

  // Listen for blop data from server
  socket.on('shake', function (message) {
    let id = message.id;
    let user = users[id] || createNewUser(id);
    let force = message.data;
    blop(user.pos, force);
  });

  // Remove disconnected users
  socket.on('disconnected', function(id){
    delete users[id];
  });
}

// Draw line based on tilt angle
// Scale strokeweight to speed
function drip(ppos, pos, speed) {
  stroke(0);
  let sw = min(10, 5/speed);
  strokeWeight(sw);
  line(ppos.x, ppos.y, pos.x, pos.y);
}

// Draw blop
function blop(pos, sz) {
  noStroke();
  fill(0, 150);
  ellipse(pos.x, pos.y, sz, sz);
}