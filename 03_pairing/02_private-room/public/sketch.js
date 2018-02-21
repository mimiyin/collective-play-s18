// Open and connect input socket
let socket = io();

// Listen for confirmation of connection
socket.on('connect', function () {
  console.log("Connected");
});

// Input field
let input;

// Is the message from me or them?
function processId(id) {
  return id == socket.id ? 'me' : 'you';
}

function setup() {
  noCanvas();

  // Listen for changes to input field
  input = select('#input');
  input.input(inputChanged);

  // Listen for texts from partners
  socket.on('text', function (message) {
    let id = processId(message.id);

    // Display it in paragraph element
    let data = message.data;
    let p = select('#' + id) || createP();
    p.attribute('id', id);
    p.html(id + ': ' + data);
  });

  // Listen for line break
  socket.on('break', function(id){
    id = processId(id);
    let p = select('#' + id);
    if(p) p.attribute('id', '');
  });

  // Remove disconnected users
  // Display "User left" message
  socket.on('leave room', function (id) {
    createP('(you left)');
  });
}

// Send user input as they type it.
function inputChanged() {
  socket.emit('text', this.value());
}

// Listen for line breaks to clear input field
function keyPressed() {
  if(keyCode == ENTER) {
    input.value('');
    socket.emit('break');
  }
}