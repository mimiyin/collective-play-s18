// Open and connect input socket
let socket = io();

// String being typed
let str = '';
// Is it my turn?
let myTurn = false;
// Canvas element
let cnv;
// Margin;
let m = 10;

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  // Disable canvas by deafult
  cnv.addClass('disabled');

  // Listen for confirmation of connection
  socket.on('connect', function () {
    console.log("Connected");

    // Draw instructions on streen
    drawString();
  });

  // Listen for my turn
  socket.on('go', function () {
    myTurn = true;
    // Enable canvas
    cnv.removeClass('disabled');
    // Update instructions on screen
    drawString();
  });

  // Listen for changes to text
  socket.on('add', function (data) {
    // Update string
    str += data;
    // Update string on screen
    drawString();
  });

  socket.on('remove', function () {
    // Remove characters from string
    str.splice(-1, 1);
    // Update string on screen
    drawString();
  });

  textAlign(LEFT, TOP);
  textSize(32);
}

// Draw string, character by character
function drawString() {
  background(255);

  // Start in upper left-hand corner
  let x = m;
  let y = m;
  fill(0);

  // If there's nothing yet...
  // Show instructions
  if (str.length == 0) {
    text(myTurn ? 'type a word' : 'wait...', x, y);

    // The above is the same as:
    // if (myTurn) {
    //   text('type a word', x, y);
    // }
    // else {
    //   text('wait...', x, y);
    // }
  }

  else {
    // Draw string, character by character
    for (let c = 0; c < str.length; c++) {
      let char = str.charAt(c);
      text(char, x, y);
      x += textWidth(char);
      // Wrap text to next line
      if (x > width - m) {
        x = 0;
        y += textAscent('h') + textDescent('p');
      }
    }
  }
}

// Only listen for ASCII keystrokes
function keyTyped() {
  // Ignore if it's not your turn
  if (!myTurn) return;

  // Send data
  socket.emit('add', key);
}

// Delete things
function keyPressed() {
  // Ignore if it's not your turn
  if (!myTurn) return;

  // Send message to remove
  if (keyCode == DELETE || keyCode == BACKSPACE) {
    socket.emit('remove');
  }
  // You're done with your turn at each word break
  else if (keyCode == ENTER || key == ' ') {
    // Send a space
    socket.emit('add', ' ');
    socket.emit('next');
    // No longer your turn
    myTurn = false;
    // Disable canvas
    cnv.addClass('disabled');
  }
}