let loginSection = document.getElementById("login-section");
let signupSection = document.getElementById("signup-section");
let navSignup = document.getElementById("navSignup");
let navLogin = document.getElementById("navLogin");
let emailError = document.getElementById("email-error");
let passwordError = document.getElementById("password-error");
let signupEmail = document.getElementById("signupEmail");
let signupPassword = document.getElementById("signupPassword");

let loginEmail = document.getElementById("loginEmail");
let loginPassword = document.getElementById("loginPassword");

let addonEmail = document.getElementById("addon-email");
let addonPassword = document.getElementById("addon-password");

let error = false;
const errLogin = "1px solid #EB5757";

window.onload = function() {
  loginEmail.focus();
};
function signup() {
  firebase
    .auth()
    .createUserWithEmailAndPassword(signupEmail.value, signupPassword.value)
    .then(function() {
      let name = document.getElementById("name").value;
      let gender = document.getElementById("gender").value;
      let age = document.getElementById("age").value;
      let height = document.getElementById("height").value;
      let weight = document.getElementById("weight").value;

      let user = firebase.auth().currentUser;
      let userRef = firebase.database().ref(`users/${user.uid}`);
      userRef
        .set({
          name,
          gender,
          age,
          height,
          weight
        })
        .then(() => {
          alert("Registration completed");
          showLogin();
        });
    })
    .catch(function(err) {
      if (err != null) {
        alert(err.message);
        return;
      }
    });
}


function login() {
  firebase
    .auth()
    .signInWithEmailAndPassword(loginEmail.value, loginPassword.value)
    .then(function() {
      window.location.href = "main.html";
    })
    .catch(function(err) {
      error = true;
      emailError.style.display = "inline";
      passwordError.style.display = "inline";

      if (err != null) {
        const errMessage = err.code;
        if (errMessage === "auth/invalid-email") {
          loginEmail.focus();
          emailError.innerHTML = "Invalid email address. Please try again.";
        }

        if (errMessage === "auth/wrong-password") {
          loginPassword.focus();
          passwordError.innerHTML = "Invalid password. Please try again.";
        }

        if (errMessage === "auth/user-not-found") {
          loginEmail.focus();
          emailError.innerHTML = "User not found. Please try again.";
        }
        return;
      }
    });
}

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

function showLogin() {
  signupSection.style.display = "none";
  loginSection.style.display = "block";
  navSignup.style.display = "block";
  navLogin.style.display = "none";
}

function showSignup() {
  loginSection.style.display = "none";
  signupSection.style.display = "block";
  navSignup.style.display = "none";
  navLogin.style.display = "block";
}

function handleError() {
  if (error) {
    emailError.style.display = "none";
    passwordError.style.display = "none";
    emailError.innerHTML = "";
    passwordError.innerHTML = "";

    addonEmail.style.borderTop = "";
    addonEmail.style.borderLeft = "";
    addonEmail.style.borderBottom = "";
    loginEmail.style.borderTop = "";
    loginEmail.style.borderBottom = "";
    loginEmail.style.borderRight = "";

    addonPassword.style.borderTop = "";
    addonPassword.style.borderLeft = "";
    addonPassword.style.borderBottom = "";
    loginPassword.style.borderTop = "";
    loginPassword.style.borderBottom = "";
    loginPassword.style.borderRight = "";

    error = false;
  }
}

loginEmail.addEventListener("focus", function() {
  if (error) {
    addonEmail.style.borderTop = errLogin;
    addonEmail.style.borderLeft = errLogin;
    addonEmail.style.borderBottom = errLogin;
    this.style.borderTop = errLogin;
    this.style.borderBottom = errLogin;
    this.style.borderRight = errLogin;
  }
});

loginPassword.addEventListener("focus", function() {
  if (error) {
    addonPassword.style.borderTop = errLogin;
    addonPassword.style.borderLeft = errLogin;
    addonPassword.style.borderBottom = errLogin;
    this.style.borderTop = errLogin;
    this.style.borderBottom = errLogin;
    this.style.borderRight = errLogin;
  }
});
