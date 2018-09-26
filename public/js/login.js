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
  validity();
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
      signUpError = true;
      $("#email-signup-error").css("display", "inline");
      $("#password-signup-error").css("display", "inline");
      console.log(err);
      if (err != null) {
        const errCode = err.code;

        if (errCode === "auth/invalid-email") {
          $("#email-signup-error").html(
            "Invalid email address. Please try again."
          );
          $("#addon-email-signup").addClass("addon-error");
          $("#signupEmail").addClass("input-error");
        }

        if (errCode === "auth/weak-password") {
          $("#password-signup-error").html(
            "The password must be of minimum length 6 characters."
          );
          $("#addon-password-signup").addClass("addon-error");
          $("#signupPassword").addClass("input-error");
        }

        if (errCode === "auth/email-already-in-use") {
          $("#email-signup-error").html(
            "Email address is already in use. Please use another email."
          );
          $("#addon-email-signup").addClass("addon-error");
          $("#signupEmail").addClass("input-error");
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

function handleEmailSignupError() {
  if (signUpError) {
    $("#email-signup-error").css("display", "none");
    $("#email-signup-error").html("");
    $("#addon-email-signup").removeClass("addon-error");
    $("#signupEmail").removeClass("input-error");
  }
}

function handlePasswordSignupError() {
  if (signUpError) {
    $("#password-signup-error").css("display", "none");
    $("#password-signup-error").html("");
    $("#addon-password-signup").removeClass("addon-error");
    $("#signupPassword").removeClass("input-error");
  }
}

function handleNameSignupError() {
  if (signUpError) {
    $("#name-signup-error").css("display", "none");
    $("#name-signup-error").html("");
    $("#addon-name").removeClass("addon-error");
    $("#signupName").removeClass("input-error");
  }
}
function handleHeightError() {
  if (signUpError) {
    $("#height-error").css("display", "none");
    $("#height-error").html("");
    $("#addon-height").removeClass("addon-error");
    $("#height").removeClass("input-error");
  }
}

function handleWeightError() {
  if (signUpError) {
    $("#weight-error").css("display", "none");
    $("#weight-error").html("");
    $("#addon-weight").removeClass("addon-error");
    $("#weight").removeClass("input-error");
  }
}
function validity() {
  if (!$("#signupName").val()) {
    signUpError = true;
    $("#signupName").addClass("input-error");
    $("#addon-name").addClass("addon-error");
    $("#name-signup-error").css("display", "inline");
    $("#name-signup-error").html("Please enter your name.");
  }
  if (!$("#signupEmail").val()) {
    signUpError = true;
    $("#signupEmail").addClass("input-error");
    $("#addon-email-signup").addClass("addon-error");
    $("#email-signup-error").css("display", "inline");
    $("#email-signup-error").html("Please enter your email address.");
  }

  if (!$("#signupPassword").val()) {
    signUpError = true;
    $("#signupPassword").addClass("input-error");
    $("#addon-password-signup").addClass("addon-error");
    $("#password-signup-error").css("display", "inline");
    $("#password-signup-error").html("Please enter your password.");
  }

  if (!$("#height").val()) {
    signUpError = true;
    $("#height").addClass("input-error");
    $("#addon-height").addClass("addon-error");
    $("#height-error").css("display", "inline");
    $("#height-error").html("Please enter your height.");
  }

  if (!$("#weight").val()) {
    signUpError = true;
    $("#weight").addClass("input-error");
    $("#addon-weight").addClass("addon-error");
    $("#weight-error").css("display", "inline");
    $("#weight-error").html("Please enter your height.");
  }

  if (
    parseInt($("#height").val()) < 120 ||
    parseInt($("#height").val()) > 200
  ) {
    signUpError = true;
    $("#height").addClass("input-error");
    $("#addon-height").addClass("addon-error");
    $("#height-error").css("display", "inline");
    $("#height-error").html("Invalid value. Please try again.");
  }

  if (parseInt($("#weight").val()) < 30 || parseInt($("#weight").val()) > 200) {
    signUpError = true;

    $("#weight").addClass("input-error");
    $("#addon-weight").addClass("addon-error");
    $("#weight-error").css("display", "inline");
    $("#weight-error").html("Invalid value. Please try again.");
  }

  if (signUpError) {
    throw "input error";
  }
}
