// Draw with the mouse

function setup(){
  createCanvas(windowWidth, windowHeight);
  background(255);
}

function draw(){
  line(mouseX, mouseY, pmouseX, pmouseY);
}