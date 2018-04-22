const gkm = require("gkm");

let timeout = null;
let keycount = 0, sumKeycount = 0;
let logoutBtn = document.getElementById("logoutBtn");

// Keyboard tracking
let day = new Date()
  .toJSON()
  .slice(0, 10)
  .replace(/-/g, "-");
let hour = new Date().getHours();

gkm.events.on("key.pressed", () => {
  ++keycount;
  let user = firebase.auth().currentUser;
  let databaseRef = firebase
    .database()
    .ref(`users/${user.uid}/keyboard/${day}/${hour}/keycount`);
  databaseRef.transaction(function (keycount) {
    keycount += 1
    return keycount;
  });
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    keycount = 0;
  }, 1000);

});

window.onload = function () {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      let databaseRef = firebase
        .database()
        .ref(`users/${user.uid}/keyboard/${day}/${hour}/keycount`);
      databaseRef.on("value", updateKeyboardCount);
    }
  });

  function updateKeyboardCount(input) {
    let keyboardCountData = input.val();
    if (keyboardCountData) {
      document.getElementById("keyboard").innerHTML = keyboardCountData;
    } else {
      document.getElementById("keyboard").innerHTML = "0";
    }
  }


  // Logout
  logoutBtn.addEventListener("click", function () {
    firebase
      .auth()
      .signOut()
      .then(function () {
        document.location.href = "login.html";
      })
      .catch(function (err) {
        alert(err);
      });
  });
};
