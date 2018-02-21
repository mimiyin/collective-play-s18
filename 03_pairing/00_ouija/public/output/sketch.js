// Open and connect input socket
let socket = io('/output');

// Listen for confirmation of connection
socket.on('connect', function () {
  console.log("Connected");
});

// Keep track of partners
let users = {};
// Keep track of average position
let pAvgPos;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Listen for message
  socket.on('message', function (message) {
    let id = message.id;
    let data = message.data;

    // Update position of user in room
    // Scaled to output screen size
    users[id] = { x: width * data.x, y: width * data.y};
  });

  // Remove disconnected users
  socket.on('disconnected', function (id) {
    delete users[id];
  });
}

function draw() {

  // Calculate avgPos of users
  let avgPos = {x: 0, y: 0};
  let num = 0;
  // Previous user
  let puser;

  // Loop through users to calculate average position
  // and check distance between users
  for (let u in users) {
    let user = users[u];
    avgPos.x += user.x;
    avgPos.y += user.y;
    num++;

    // Check distance between this user and previous user
    if(puser) {
      let d = dist(user.x, user.y, puser.x, puser.y);
      if(d > 250) background(255);
    }
    // Remember this user as previous user for next time through loop
    puser = users[u];
  }
  avgPos.x /= num;
  avgPos.y /= num;

  // Only draw if there's a previous average position
  // And more than 1 person is drawing
  if (pAvgPos && num > 1) {
    // Draw line of average positions
    line(pAvgPos.x, pAvgPos.y, avgPos.x, avgPos.y);
  }
  // Remember average position for next frame
  pAvgPos = avgPos;
}