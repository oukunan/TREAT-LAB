const notifier = require("node-notifier");
const gkm = require("gkm");

const pressedKeys = {};
let tmpCounterHistory = 0,
  tracker,
  trigHeight = 0,
  ypos = 0,
  alarm = false,
  isLine = false,
  checkFace = false,
  counter = 0,
  positions,
  secSit = 0,
  secRelax = 0,
  timeout = null,
  keycount = 0,
  mouseClickCount = 0,
  mouseCounter = 0,
  showSit = 0,
  showRelax = 0,
  showMouse = 0,
  mouseTimerout,
  mouseBoolean = false,
  oneDayData = null,
  sumBends = 0,
  sumSit = 0,
  sumRelax = 0,
  sumKeyboard = 0,
  sumMouse = 0,
  user = null,
  date = moment(new Date()).format("DD-MM-YYYY"),
  hour = moment(new Date()).format("HH");


// --------- Load data after login -----------
window.onload = () => {
  const expireDate = localStorage.getItem("expirationDate");
  if (expireDate) {
    if (new Date(expireDate).getTime() < new Date().getTime()) {
      logout();
    }
  }

  user = localStorage.getItem("userId");
  const oneDayRef = firebase.database().ref(`users/${user}/behavior/${date}`);
  const nameRef = firebase.database().ref(`users/${user}/info/name`);
  const keyboardRef = firebase
    .database()
    .ref(`users/${user}/behavior/${date}/${hour}/keyboard/keycount`);
  const mouseRef = firebase
    .database()
    .ref(`users/${user}/behavior/${date}/${hour}/mouse/mouseClickCount`);

  oneDayRef.on("value", received => {
    generateEachBehavior(received.val());
  });

  nameRef.on("value", received => {
    let name = received.val();
    if (name) {
      document.getElementById("name").innerHTML = name;
      document.getElementById("topName").innerHTML = name;
    }
  });

  getHistory();
};

//------- Image processing -----------
function setup() {
  let videoInput = createCapture(VIDEO);
  videoInput.size(400, 300);
  videoInput.parent("sketch-holder");

  let cnv = createCanvas(400, 300);
  cnv.parent("sketch-holder2");

  tracker = new clm.tracker();
  tracker.init(pModel);
  tracker.start(videoInput.elt);
}

function draw() {
  clear();
  noStroke();

  positions = tracker.getCurrentPosition();
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
        notification("Mind your posture", "Your head is bending down");
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

// -------- Save bending data -------------
function bendCount() {
  let bendRef = firebase
    .database()
    .ref(`users/${user}/behavior/${date}/${hour}/bends/count`);
  bendRef.transaction(count => {
    count += 1;
    return count;
  });
}

// -------- Mouse part -------------
gkm.events.on("mouse.*", () => {
  mouseBoolean = true;
  const formatted = moment.utc(showMouse * 1000).format("HH:mm:ss");
  document.getElementById("mouse").innerHTML = `${formatted}`;
  if (mouseTimerout) {
    clearTimeout(mouseTimerout);
  }
  mouseTimerout = setTimeout(mouseStop, 150);
});

function mouseStop() {
  mouseBoolean = false;
  let mouseRef = firebase
    .database()
    .ref(`users/${user}/behavior/${date}/${hour}/mouse/mouseClickCount`);
  let tmpMouseCounter = mouseCounter;

  mouseRef.transaction(mouseClickCount => {
    mouseClickCount += tmpMouseCounter;
    mouseCounter = 0;
    return mouseClickCount;
  });
}

// //---------Keyboard tracking--------------
gkm.events.on("key.pressed", data => {
  if (pressedKeys[data]) {
    return;
  }
  pressedKeys[data] = true;
  ++keycount;
  let keyboardRef = firebase
    .database()
    .ref(`users/${user}/behavior/${date}/${hour}/keyboard/keycount`);
  keyboardRef.transaction(keycount => {
    keycount += 1;
    return keycount;
  });
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    keycount = 0;
  }, 1000);
});

gkm.events.on("key.released", function(data) {
  delete pressedKeys[data];
});

// --------- Timer for sit duration -------------
function sitTimer() {
  let sitRef = firebase
    .database()
    .ref(`users/${user}/behavior/${date}/${hour}/sit/duration`);
  let relaxRef = firebase
    .database()
    .ref(`users/${user}/behavior/${date}/${hour}/relax/duration`);

  if (typeof positions === "object") {
    ++secSit;
    ++showSit;

    if (showSit % 1800 == 0) {
      notification("Go get some rest", "Now you have to sit for 30 minutes");
    }

    const formatted = moment.utc(showSit * 1000).format("HH:mm:ss");
    document.getElementById("sit").innerHTML = `${formatted}`;

    let tmpSecRelax = secRelax;
    relaxRef.transaction(duration => {
      duration += tmpSecRelax;
      secRelax = 0;
      return duration;
    });
  } else {
    ++secRelax;
    ++showRelax;

    const formatted = moment.utc(showRelax * 1000).format("HH:mm:ss");
    document.getElementById("relax").innerHTML = `${formatted}`;

    let tmpSecSit = secSit;
    sitRef.transaction(duration => {
      duration += tmpSecSit;
      secSit = 0;
      return duration;
    });
  }
}

// ------- History --------------
function getHistory() {
  tmpCounterHistory++;
  if (tmpCounterHistory > 2) {
    return;
  }
  let bendTotal = 0,
    sitTotal = 0,
    relaxTotal = 0,
    objectData = {};
  const behaviorValue = [];
  const key = [];
  let finalData = [];
  const notFilterHistory = firebase.database().ref(`users/${user}/behavior`);
  notFilterHistory.on("child_added", received => {
    behaviorValue.push(received.val());
    key.push(received.key);

    for (let i = 0; i < behaviorValue.length; i++) {
      bendTotal = 0;
      sitTotal = 0;
      relaxTotal = 0;
      objectData = {};
      for (let day in behaviorValue[i]) {
        bendTotal += behaviorValue[i][day].hasOwnProperty("bends")
          ? behaviorValue[i][day].bends.count
          : 0;
        sitTotal += behaviorValue[i][day].hasOwnProperty("sit")
          ? behaviorValue[i][day].sit.duration
          : 0;
        relaxTotal += behaviorValue[i][day].hasOwnProperty("relax")
          ? behaviorValue[i][day].relax.duration
          : 0;
      }
      objectData[key[i]] = {
        bends: bendTotal,
        sit: sitTotal,
        relax: relaxTotal
      };
    }
    finalData.push(objectData);
  });

  const today = moment().format("DD-MM-YYYY");
  const lastSevenDay = moment()
    .subtract(7, "d")
    .format("DD-MM-YYYY");

  const filteredData = finalData.filter(i => {
    return Object.keys(i) < today && Object.keys(i) >= lastSevenDay;
  });

  for (let i = 0; i < filteredData.length; i++) {
    const formattedSit = formatShow(
      filteredData[i][Object.keys(filteredData[i])].sit
    );
    const formattedRelax = formatShow(
      filteredData[i][Object.keys(filteredData[i])].relax
    );

    const formattedMouse = formatShow(
      filteredData[i][Object.keys(filteredData[i])].mouse
    );
    $("#eachDay").append(
      `<div class="col-md-4">
            <div class="col-md-12 historyItem">
                <h4>${Object.keys(filteredData[i])}</h4>
                <p><strong>Bending: </strong>${filteredData[i][
                  Object.keys(filteredData[i])
                ].bends || 0}</p>
                <p><strong>Sit: </strong>${formattedSit || 0}</p>
                <p><strong>Relax: </strong>${formattedRelax || 0}</p>
                <p><strong>Mouse: </strong>${formattedMouse || 0}</p>
                <p><strong>Keyboard: </strong>${filteredData[i][
                  Object.keys(filteredData[i])
                ].relax || 0}</p>
            </div>
          </div>`
    );
  }
}

function generateEachBehavior(data) {
  sumBends = 0;
  sumSit = 0;
  sumRelax = 0;
  sumKeyboard = 0;
  sumMouse = 0;

  for (let key in data) {
    sumBends += data[key].bends ? data[key].bends.count : 0;
    sumSit += data[key].sit ? data[key].sit.duration : 0;
    sumRelax += data[key].relax ? data[key].relax.duration : 0;
    sumKeyboard += data[key].keyboard ? data[key].keyboard.keycount : 0;
    sumMouse += data[key].mouse ? data[key].mouse.mouseClickCount : 0;
  }

  document.getElementById("showBend").innerHTML = sumBends;

  showSit = sumSit;
  document.getElementById("sit").innerHTML = `${formatBehaviorTime(sumSit)}`;

  showRelax = sumRelax;
  document.getElementById("relax").innerHTML = `${formatBehaviorTime(
    sumRelax
  )}`;

  if (sumKeyboard % 10000 == 0 && sumKeyboard !== 0) {
    notification("Go get some rest", "Number of keystroke is too many");
  }
  document.getElementById("keyboard").innerHTML = sumKeyboard;

  showMouse = sumMouse;
  if (sumMouse % 100 == 0 && sumMouse !== 0) {
    notification("DANGER", "Number of mouse click is too many");
  }
  document.getElementById("mouse").innerHTML = formatBehaviorTime(sumMouse);
}

//------ Timer ----------------------
function checkMouseTimer() {
  if (mouseBoolean) {
    mouseTimer();
  }
}
function mouseTimer() {
  setInterval(++mouseCounter, ++showMouse, 1000);
}
function timer() {
  setTimeout(function() {
    ++counter;
  }, 1000);
}

//------ Interval function ----------
setInterval(headUp, 1000);
setInterval(checkMouseTimer, 1000);
setInterval(sitTimer, 1000);

document.getElementById("dateValue").innerHTML = moment().format("LL");
