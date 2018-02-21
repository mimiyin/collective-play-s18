// Open and connect input socket
let socket = io('/input');

// Listen for confirmation of connection
socket.on('connect', function () {
  console.log("Connected");
});

// Keep track of partners
let users = {};

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Listen for message from partners
  socket.on('message', function (message) {
    let id = message.id;
    let data = message.data;
    users[id] = {x: width * data.x, y: width * data.y};
  });

  // Remove disconnected users
  socket.on('disconnected', function (id) {
    delete users[id];
  });
}

function draw() {
  background(255);
  // Draw a dot for each user
  noStroke();
  for (let u in users) {
    let user = users[u];
    // If this user is me, make it red
    if (u == socket.id) fill('red');
    // Otherwise, blue
    else fill('blue');
    ellipse(user.x, user.y, 50, 50);
  }

  // Send proportional, normalized mouse data
  let x = mouseX / width;
  let y = mouseY / width;
  socket.emit('data', {
    x: x,
    y: y
  });
}