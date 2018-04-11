var ctracker;
var trigHeight = 0;
var ypos = 0;
var button;
var alarm = false;
var isLine = false;
var checkFace = false;
var counter = 0;
let date = new Date()
  .toJSON()
  .slice(0, 10)
  .replace(/-/g, "-");

function setup() {
  var videoInput = createCapture(VIDEO);
  videoInput.size(400, 300);
  videoInput.parent("sketch-holder");

  var cnv = createCanvas(400, 300);
  cnv.parent("sketch-holder2");

  ctracker = new clm.tracker();
  ctracker.init(pModel);
  ctracker.start(videoInput.elt);

  button = createButton("set height");
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
  trigHeight = ypos + 15;
  isLine = true;
  checkFace = true;
  alarm = true;
}

function headUp() {
  if (checkFace) {
    if (ypos > trigHeight && alarm) {
      timer();
      if (counter == 2) {
        let myNotification = new Notification("Mind your posture", {
          body: "Your head is bending down."
        });
        bendCount();
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

function updateCount(received) {
  let data = received.val();
  document.getElementById("showBend").innerHTML = data;
}

// Save and Retrive data
function bendCount() {
  let user = firebase.auth().currentUser;
  let databaseRef = firebase
    .database()
    .ref(`users/${user.uid}/bends/${date}/count`);
  databaseRef.transaction(function(count) {
    count += 1;
    return count;
  });

  databaseRef.on("value", updateCount);
}

window.onload = function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      let databaseRef = firebase
        .database()
        .ref(`users/${user.uid}/bends/${date}/count`);
      databaseRef.on("value", updateCount);
    }
  });
};
