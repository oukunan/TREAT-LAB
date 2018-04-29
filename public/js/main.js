const notifier = require("node-notifier");
const gkm = require("gkm");

let ctracker;
let trigHeight = 0;
let ypos = 0;
let button;
let alarm = false;
let isLine = false;
let checkFace = false;
let counter = 0;
let positions;
let sec = 0;
let timeout = null;
let keycount = 0,
  sumKeycount = 0;
let logoutBtn = document.getElementById("logoutBtn");
let date = moment(new Date()).format("DD-MM-YYYY ");
let hour = moment(new Date()).format("HH");


//------- Image proceessing -----------
function setup() {
  let videoInput = createCapture(VIDEO);
  videoInput.size(400, 300);
  videoInput.parent("sketch-holder");

  let cnv = createCanvas(400, 300);
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

  positions = ctracker.getCurrentPosition();
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
        notifier.notify({
          title: "Mind your posture",
          message: "Your Head is bending down."
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

// --------- Keyboard tracking --------------
gkm.events.on("key.pressed", () => {
  ++keycount;
  let user = firebase.auth().currentUser;
  let keyboardRef = firebase
    .database()
    .ref(`users/${user.uid}/keyboard/${date}/${hour}/keycount`);
  keyboardRef.transaction(keycount => {
    keycount += 1;
    return keycount;
  });
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    keycount = 0;
  }, 1000);
});

// --------- Timer for sit duration -------------
function sitTimer() {
  if (typeof positions === "object") {
    ++sec;
    document.getElementById("timer").innerHTML = `${sec} s`;
  }
}
setInterval(sitTimer, 1000);

// Save and Retrive data
function bendCount() {
  let user = firebase.auth().currentUser;
  let bendRef = firebase
    .database()
    .ref(`users/${user.uid}/bends/${date}/${hour}/count`);
  bendRef.transaction(count => {
    count += 1;
    return count;
  });
}

// --------- Load data after login -----------
window.onload = () => {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      let bendRef = firebase
        .database()
        .ref(`users/${user.uid}/bends/${date}/${hour}/count`);
      let keyboardRef = firebase
        .database()
        .ref(`users/${user.uid}/keyboard/${date}/${hour}/keycount`);

      bendRef.on("value", received => {
        let data = received.val();
        if (data) {
          document.getElementById("showBend").innerHTML = data;
        } else {
          document.getElementById("showBend").innerHTML = "0";
        }
      });
      keyboardRef.on("value", received => {
        let keyboardCountData = received.val();
        if (keyboardCountData) {
          document.getElementById("keyboard").innerHTML = keyboardCountData;
        } else {
          document.getElementById("keyboard").innerHTML = "0";
        }
      });
    }
  });
};

// -------- Logout ------------
logoutBtn.addEventListener("click", () => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      document.location.href = "login.html";
    })
    .catch(err => {
      alert(err);
    });
});
