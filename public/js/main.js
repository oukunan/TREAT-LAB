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
let secSit = 0;
let secRelex = 0;
let timeout = null;
let keycount = 0;
let mouseClickCount = 0;
let sumKeycount = 0;
let alwaySit = 0;
let alwayRelax = 0;
let showSit = 0;
let showRelax = 0;
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
        notifier.notify({title: "Mind your posture", message: "Your Head is bending down."});

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
  setTimeout(function () {
    ++counter;
  }, 1000);
}

setInterval(headUp, 1000);

// -------- Save beding data -------------
function bendCount() {
  let user = firebase
    .auth()
    .currentUser;
  let bendRef = firebase
    .database()
    .ref(`users/${user.uid}/bends/${date}/${hour}/count`);
  bendRef.transaction(count => {
    count += 1;
    return count;
  });
}

// -------- Mouse part -------------
gkm
  .events
  .on("mouse.pressed", () => {
    ++mouseClickCount;
    let user = firebase
      .auth()
      .currentUser;
    let mouseRef = firebase
      .database()
      .ref(`users/${user.uid}/mouse/${date}/${hour}/mouseClickCount`);
    mouseRef.transaction(mouseClickCount => {
      mouseClickCount += 1;
      return mouseClickCount;
    });
  });

// --------- Keyboard tracking --------------
gkm
  .events
  .on("key.pressed", () => {
    ++keycount;
    let user = firebase
      .auth()
      .currentUser;
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
  let user = firebase
    .auth()
    .currentUser;
  let sitRef = firebase
    .database()
    .ref(`users/${user.uid}/sit/${date}/${hour}/duration`);
  let relaxRef = firebase
    .database()
    .ref(`users/${user.uid}/relax/${date}/${hour}/duration`);
  if (typeof positions === "object") {
    ++secSit;
    ++showSit;
    if (showSit % 1800 == 0) {
      notifier.notify({title: "Go get some rest", message: "You work for 1 hour"});
    }
    const formatted = moment
      .utc(showSit * 1000)
      .format("HH:mm:ss");
    document
      .getElementById("sit")
      .innerHTML = `${formatted}`;
    let tmpSecRelax = secRelex;
    relaxRef.transaction(duration => {
      duration += tmpSecRelax;
      secRelex = 0;
      return duration;
    });
  } else {
    ++secRelex;
    ++showRelax;
    const formatted = moment
      .utc(showRelax * 1000)
      .format("HH:mm:ss");
    document
      .getElementById("relax")
      .innerHTML = `${formatted}`;
    let tmpSecSit = secSit;
    sitRef.transaction(duration => {
      duration += tmpSecSit;
      secSit = 0;
      return duration;
    });
  }
}
setInterval(sitTimer, 1000);

// --------- Load data after login -----------
window.onload = () => {
  firebase
    .auth()
    .onAuthStateChanged(user => {
      if (user) {
        let nameRef = firebase
          .database()
          .ref(`users/${user.uid}/name`)
        let bendRef = firebase
          .database()
          .ref(`users/${user.uid}/bends/${date}/${hour}/count`);
        let keyboardRef = firebase
          .database()
          .ref(`users/${user.uid}/keyboard/${date}/${hour}/keycount`);
        let mouseRef = firebase
          .database()
          .ref(`users/${user.uid}/mouse/${date}/${hour}/mouseClickCount`);
        let sitRef = firebase
          .database()
          .ref(`users/${user.uid}/sit/${date}/${hour}/duration`);
        let relaxRef = firebase
          .database()
          .ref(`users/${user.uid}/relax/${date}/${hour}/duration`);

        nameRef.on('value', received => {
          let name = received.val();
          if (name) {
            document
              .getElementById('name')
              .innerHTML = name
            document
              .getElementById('topName')
              .innerHTML = name
          }
        })
        bendRef.on("value", received => {
          let data = received.val();
          if (data) {
            document
              .getElementById("showBend")
              .innerHTML = data;
          } else {
            document
              .getElementById("showBend")
              .innerHTML = "0";
          }
        });
        keyboardRef.on("value", received => {
          let keyboardCountData = received.val();
          if (keyboardCountData) {
            if (keyboardCountData % 8000 == 0) {
              notifier.notify({title: "DANGER", message: "Number of keystroke is too many"});
            }
            document
              .getElementById("keyboard")
              .innerHTML = keyboardCountData;
          } else {
            document
              .getElementById("keyboard")
              .innerHTML = "0";
          }
        });

        mouseRef.on("value", received => {
          let mouseCountData = received.val();
          if (mouseCountData) {
            if (mouseCountData % 100 == 0) {
              notifier.notify({title: "DANGER", message: "Number of mouse click is too many"});
            }
            document
              .getElementById("mouse")
              .innerHTML = mouseCountData;
          } else {
            document
              .getElementById("mouse")
              .innerHTML = "0";
          }
        });

        sitRef.on("value", received => {
          let sitDuration = received.val();
          if (sitDuration) {
            showSit = sitDuration;
            const formatted = moment
              .utc(sitDuration * 1000)
              .format("HH:mm:ss");
            document
              .getElementById("sit")
              .innerHTML = `${formatted}`;
          } else {
            document
              .getElementById("sit")
              .innerHTML = "00:00:00";
          }
        });

        relaxRef.on("value", received => {
          let sitRelax = received.val();
          if (sitRelax) {
            showRelax = sitRelax;
            const formatted = moment
              .utc(sitRelax * 1000)
              .format("HH:mm:ss");
            document
              .getElementById("relax")
              .innerHTML = `${formatted}`;
          } else {
            document
              .getElementById("relax")
              .innerHTML = "00:00:00";
          }
        });
      }
    });
};

// -------- Logout ------------
function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      document.location.href = "login.html";
    })
    .catch(err => {
      alert(err);
    });
}

document
  .getElementById('dateValue')
  .innerHTML = moment().format('LL');