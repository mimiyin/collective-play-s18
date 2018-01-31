// Open and connect output socket
let socket = io('/output');

// Listen for confirmation of connection
socket.on('connect', function () {
  console.log("Connected");
});

// Keep track of users
let users = {};

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);

  // Listen for add message from server
  socket.on('add', function (message) {
    //console.log(message);
    let id = message.id;
    let speed = message.data.speed;
    let charToAdd = message.data.add;
    let numCharsToRemove = message.data.remove;

    // New user
    if (!(id in users)) {
      users[id] = {
        text: '',
        speed: 10,
        pos: {
          x: random(width),
          y: random(height)
        }
      }
    }

    // Update speed
    users[id].speed = speed;
    users[id].text += charToAdd;
  });

  // Listen for remove message from server
  socket.on('remove', function (id) {
    // Ignore unregistered users
    if (!(id in users)) {
      return;
    }
    users[id].text = users[id].text.slice(0, -1);
  });

  // Listen for next message from server
  socket.on('next', function (id) {
    // Ignore unregistered users
    if (!(id in users)) {
      return;
    }
    users[id].text = '';
  });

  // Remove disconnected users
  socket.on('disconnected', function (id) {
    delete users[id];
  });
}

// Display text
// Scale size of text to speed of typing
function draw() {
  background(255);
  for (let id in users) {
    let user = users[id];
    let txt = user.text;
    let pos = user.pos;
    let speed = user.speed;
    textSize(speed * 5000);
    text(txt, pos.x, pos.y);
  }
}