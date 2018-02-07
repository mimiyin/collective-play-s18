// Open and connect output socket
let socket = io('/output');

// Listen for confirmation of connection
socket.on('connect', function() {
  console.log("Connected");
});

// Keep track of users
let users = {};
// Keep track of number of users
let num = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  rectMode(CENTER);
  colorMode(HSB, 100);

  // Listen for message from server
  socket.on('message', function (message) {
    //console.log(message);
    let id = message.id;
    let data = message.data;

    // New user
    if(!(id in users)) {
      users[id] = 0;
      num++;
    }

    // Update data
    users[id] += data;
  });


  // Remove disconnected users
  socket.on('disconnected', function(id){
    delete users[id];
    num--;
  });
}

// Scale color to mic level
function draw() {
  let n = num;
  noStroke();
  for(let u in users) {
    let user = users[u];
    let hue = user;
    fill(hue, 100, 100);
    rect(width/2, height/2, width*n/num, height*n/num);
    n--;
  }
}