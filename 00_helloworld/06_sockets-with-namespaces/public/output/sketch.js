// Open and connect output socket
let socket = io('/output');
// Keep track of users
let users = {};

// Create new user
function createNewUser(id) {
  users[id] = {
    username: '',
    positions: []
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);

    // Listen for updates to usernames
  socket.on('username', function (message) {
    let id = message.id;
    let username = message.username;

    // New user
    if (!(id in users)) {
      createNewUser(id);
    }

    // Update username
    users[id].username = username;
  });

  // Receive message from server
  socket.on('message', function (message) {
    //console.log(message);
    let id = message.id;
    let pos = message.data;

    // New user
    if (!(id in users)) {
      createNewUser(id);
    }
    // Add position
    // Remove oldest position if > 50 positions
    let positions = users[id].positions;
    positions.push(pos);
    if (positions.length > 50) positions.shift();
  });

  // Remove disconnected users
  socket.on('disconnected', function(id){
    delete users[id];
  });
}

// Draw the snake
// Change the background
function draw() {
  let sz = frameCount%255;
  background(sz);
  for (let id in users) {
    let user = users[id];
    let username = user.username;
    let positions = user.positions;
    for (let p = 0; p < positions.length; p++) {
      let pos = positions[p];
      push();
      translate(pos.x, pos.y);
      noStroke();
      fill(255, sz);
      ellipse(0, 0, sz/p+1, sz/p+1);

      // Draw username at the end of the snake
      if(p == 0) {
        text(username, 10, 0);
      }
      pop();
    }
  }
}