let loginSection = document.getElementById('login-section')
let signupSection = document.getElementById('signup-section')
let navSignup = document.getElementById('navSignup')
let navLogin = document.getElementById('navLogin')

function signup() {
  let email = document.getElementById("signEmail").value;
  let password = document.getElementById("signPassword").value;
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(function() {
      let gender = document.getElementById('gender').value;
      let age = document.getElementById('age').value;
      let height = document.getElementById('height').value;
      let weight = document.getElementById('weight').value;

      let user = firebase.auth().currentUser;
      let userRef = firebase.database().ref(`users/${user.uid}`);
      userRef.set({
        gender,
        age,
        height,
        weight
      }).then(() => {
        alert('Registration completed')
        showLogin()
      })
    })
    .catch(function(err) {
      if (err != null) {
        alert(err.message);
        return;
      }
    });
}

function login(){
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(function() {
      window.location.href = "main.html";
    })
    .catch(function(err) {
      if (err != null) {
        console.log(err.message);
        return;
      }
    });   
}


function showLogin() {
  signupSection.style.display = "none"
  loginSection.style.display = "block"
  navSignup.style.display = "block"
  navLogin.style.display = "none"
}

function showSignup() {
  loginSection.style.display = "none"
  signupSection.style.display = "block"
  navSignup.style.display = "none"
  navLogin.style.display = "block"
}
