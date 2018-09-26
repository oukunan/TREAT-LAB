let loginSection = document.getElementById("login-section");
let signupSection = document.getElementById("signup-section");
let navSignup = document.getElementById("navSignup");
let navLogin = document.getElementById("navLogin");
let emailError = document.getElementById("email-error");
let passwordError = document.getElementById("password-error");
let signupEmail = document.getElementById("signupEmail");
let signupPassword = document.getElementById("signupPassword");
let topic = document.getElementById("topic");

let loginEmail = document.getElementById("loginEmail");
let loginPassword = document.getElementById("loginPassword");

let addonEmail = document.getElementById("addon-email");
let addonPassword = document.getElementById("addon-password");

let addonEmailSignup = document.getElementById("addon-email-signup");

let emailSignupError = document.getElementById("email-signup-error");

let error = false;
let signUpError = false;
const errLoginStyle = "1px solid #EB5757";

window.onload = function() {
  loginEmail.focus();
};
function signup() {
  firebase
    .auth()
    .createUserWithEmailAndPassword(signupEmail.value, signupPassword.value)
    .then(function() {
      let name = document.getElementById("signupName");
      let gender = document.getElementById("gender");
      let age = document.getElementById("age");
      let height = document.getElementById("height");
      let weight = document.getElementById("weight");

      let user = firebase.auth().currentUser;
      let userRef = firebase.database().ref(`users/${user.uid}`);
      userRef
        .set({
          name: name.value,
          gender: gender.value,
          age: age.value,
          height: age.value,
          weight: weight.value
        })
        .then(() => {
          alert("Registration completed");
          signupEmail.value = "";
          signupPassword.value = "";
          name.value = "";
          gender.value = "";
          age.value = "";
          height.value = "";
          weight.value = "";
          showLogin();
        });
    })
    .catch(function(err) {
      console.log(err);
      signUpError = true;
      emailSignupError.style.display = "inline";

      if (err != null) {
        const errCode = err.code;

        if (errCode === "auth/invalid-email") {
          signupEmail.focus();
          emailSignupError.innerHTML =
            "Invalid email address. Please try again.";
        }
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
        const errCode = err.code;
        if (errCode === "auth/invalid-email") {
          loginEmail.focus();
          emailError.innerHTML = "Invalid email address. Please try again.";
        }

        if (errCode === "auth/wrong-password") {
          loginPassword.focus();
          passwordError.innerHTML = "Invalid password. Please try again.";
        }

        if (errCode === "auth/user-not-found") {
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
  topic.innerHTML = "Login";
}

function showSignup() {
  loginSection.style.display = "none";
  signupSection.style.display = "block";
  navSignup.style.display = "none";
  navLogin.style.display = "block";
  topic.innerHTML = "Sign up";
}

function handleError() {
  if (error) {
    emailError.style.display = "none";
    passwordError.style.display = "none";
    emailError.innerHTML = "";
    passwordError.innerHTML = "";

    addonEmail.style = {};
    loginEmail.style = {};

    addonPassword.style = {};
    loginPassword.style = {};

    error = false;
  }
}

loginEmail.addEventListener("focus", function() {
  if (error) {
    addonEmail.style.borderTop = errLoginStyle;
    addonEmail.style.borderLeft = errLoginStyle;
    addonEmail.style.borderBottom = errLoginStyle;
    this.style.borderTop = errLoginStyle;
    this.style.borderBottom = errLoginStyle;
    this.style.borderRight = errLoginStyle;
  }
});

loginPassword.addEventListener("focus", function() {
  if (error) {
    addonPassword.style.borderTop = errLoginStyle;
    addonPassword.style.borderLeft = errLoginStyle;
    addonPassword.style.borderBottom = errLoginStyle;
    this.style.borderTop = errLoginStyle;
    this.style.borderBottom = errLoginStyle;
    this.style.borderRight = errLoginStyle;
  }
});

function handleSignUpError() {
  if (signUpError) {
    emailSignupError.style.display = "none";
    // passwordError.style.display = "none";
    emailSignupError.innerHTML = "";
    // passwordError.innerHTML = "";

    addonEmailSignup.style = {};
    signupEmail.style = {};
  }
}

signupEmail.addEventListener("focus", function() {
  if (signUpError) {
    addonEmailSignup.style.borderTop = errLoginStyle;
    addonEmailSignup.style.borderLeft = errLoginStyle;
    addonEmailSignup.style.borderBottom = errLoginStyle;

    this.style.borderTop = errLoginStyle;
    this.style.borderBottom = errLoginStyle;
    this.style.borderRight = errLoginStyle;
  }
});
