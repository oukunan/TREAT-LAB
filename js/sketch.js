let ctracker;
let trigHeight = 0;
let ypos = 0;
let button;
let alarm = false;
let isLine = false;
let checkFace = false;
let counter = 0;

function setup() {
  var videoInput = createCapture(VIDEO);
  videoInput.size(400, 300);
  videoInput.position(0, 0);

  var cnv = createCanvas(400, 300);
  cnv.position(0, 0);

  ctracker = new clm.tracker();
  ctracker.init(pModel);
  ctracker.start(videoInput.elt);

  button = createButton("set height");
  button.position(150, 260);
  button.mousePressed(setHeight);
}

function draw() {
  clear();
  noStroke();

  var positions = ctracker.getCurrentPosition();
  for (var i = 0; i < positions.length; i++) {
    fill(0, 255, 0);
    rect(positions[i][0], positions[i][1], 3, 3);
    if (i == 20) {
      ypos = positions[i][1];
    }
  }

  stroke("rgb(0,255,0)");
  strokeWeight(4);
  isLine && line(0, trigHeight, width * 2, trigHeight);
}

function setHeight() {
  trigHeight = ypos + 5;
  isLine = true;
  checkFace = true;
  alarm = true;
}

function headUp() {
  if (checkFace) {
    if (ypos > trigHeight && alarm) {
      timer();
      if (counter == 2) {
        console.log("ALERT");
        alarm = false;
        counter = 0;
        clearInterval(timer);
      }
    }
    if (ypos <= trigHeight) {
      alarm = true;
      counter = 0;
    }
  }
}

function timer() {
  console.log(counter);
  setTimeout(function() {
    ++counter;
  }, 1000);
}

setInterval(headUp, 1000);
