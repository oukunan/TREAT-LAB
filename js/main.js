const gkm = require("gkm");

let timeout = null;
let count = 0;
let logoutBtn = document.getElementById("logoutBtn");

// Keyboard tracking
gkm.events.on("key.pressed", () => {
  ++count;
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    count = 0;
  }, 1500);
});

// Get Current User
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
  } else {
    document.location.href = "login.html";
  }
});

// Logout
logoutBtn.addEventListener("click", function() {
  firebase
    .auth()
    .signOut()
    .then(function() {
      document.location.href = "login.html";
    })
    .catch(function(err) {
      alert(err);
    });
});
