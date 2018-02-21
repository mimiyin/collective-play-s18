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
  textAlign(CENTER, CENTER);

  // Listen for add message from server
  socket.on('add', function (message) {
    //console.log(message);
    let id = message.id;
    let speed = message.data.speed;
    let charToAdd = message.data.add;

    // New user
    if (!(id in users)) {
      users[id] = {
        text: '',
        speed: 10,
        pos: {
          x: random(50, width-50),
          y: random(50, height-50)
        }
      }
    }

    // Update speed for user
    users[id].speed = speed;
    // Update string for user
    users[id].text += charToAdd;
  });

  // Listen for remove message from server
  socket.on('remove', function (id) {
    // Ignore unregistered users
    if (!(id in users)) {
      return;
    }
    // Remove last character in string
    users[id].text = users[id].text.slice(0, -1);
  });

  // Listen for next message from server
  socket.on('next', function (id) {
    // Ignore unregistered users
    if (!(id in users)) {
      return;
    }
    // Empty out string
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