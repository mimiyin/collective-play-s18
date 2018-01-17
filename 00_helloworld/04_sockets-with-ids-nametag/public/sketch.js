// Open and connect socket
let socket = io();
// Keep track of users
let users = {};

// Create new user
// with nametag element
// and position
function createNewUser(id) {
  users[id] = {
    elt: createP(''),
    pos: undefined
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);

  // Select input and listen for changes
  select("#username").input(usernameChanged);

  // Listen for confirmation of connection
  socket.on('connect', function () {
    console.log("Connected");
  });

  // Listen for updates to usernames
  socket.on('username', function (message) {
    let id = message.id;
    let username = message.username;

    // New user
    if (!(id in users)) {
      createNewUser(id);
    }
    // Update namtetag element with new username
    users[id].elt.html(username);
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
    // Position the nametag element
    users[id].elt.position(pos.x, pos.y);
    users[id].pos = pos;
  });

  // Remove disconnected users
  socket.on('disconnected', function(id){
    delete users[id];
  });
}

// How would you draw a line from current position to previous position?
function draw() {
  fill(0);
  // Draw all users positions
  for(let id in users) {
    let user = users[id];
    let pos = user.pos;
    push();
    translate(pos.x, pos.y);
    ellipse(0, 0, 10, 10);
    pop();
  }
}

// Send mouse position only when mouse moves
function mouseMoved(){
  socket.emit('data', {x: mouseX, y: mouseY});
}

// Send username as it changes
function usernameChanged(){
  socket.emit('username', this.value());
}


