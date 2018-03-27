// Open and connect input socket
let socket = io();

// Listen for confirmation of connection
socket.on('connect', function () {
  console.log("Connected");
});

// Input field
let input;


function setup() {
  noCanvas();

  // Listen for changes to input field
  input = select('#input');
  input.input(inputChanged);

  // Listen for texts from partners
  socket.on('text', function (data) {
    display(data);
  });

  // Remove disconnected users
  // Display "User left" message
  socket.on('leave room', function () {
    display('(they left...)');
  });
}

// Display text
function display(txt) {
  removeElements();
  let p = createP();
  p.removeClass('fade').addClass('fade');
  p.html(txt);
}

// Send user input as they type it.
function inputChanged() {
  socket.emit('text', this.value());
}

// Listen for line breaks to clear input field
function keyPressed() {
  if(keyCode == ENTER) {
    input.value('');
  }
}