let signUpBtn = document.getElementById("signUpBtn");
let signInBtn = document.getElementById("signInBtn");

signUpBtn.addEventListener("click", function() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(function() {
      alert("User create.");
    })
    .catch(function(err) {
      if (err != null) {
        console.log(err.message);
        return;
      }
    });
});
signInBtn.addEventListener("click", function() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(function() {
      document.location.href = "main.html";
    })
    .catch(function(err) {
      if (err != null) {
        console.log(err.message);
        return;
      }
    });
});
