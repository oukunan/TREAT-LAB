let loginSection = document.getElementById('login-section');
let signupSection = document.getElementById('signup-section');
let forgetPass = document.getElementById('forgetPass-section');
let forgetInput = document.getElementById('forgetEmail');
let navSignup = document.getElementById('navSignup');
let navLogin = document.getElementById('navLogin');
let emailError = document.getElementById('email-error');
let passwordError = document.getElementById('password-error');
let signupEmail = document.getElementById('signupEmail');
let signupPassword = document.getElementById('signupPassword');
let topic = document.getElementById('topic');

let loginEmail = document.getElementById('loginEmail');
let loginPassword = document.getElementById('loginPassword');

let addonEmail = document.getElementById('addon-email');
let addonPassword = document.getElementById('addon-password');

let addonEmailSignup = document.getElementById('addon-email-signup');

let emailSignupError = document.getElementById('email-signup-error');

let someVariable = false;
let error = false;
let signUpError = false;

const emailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

let signUpNameErr = false,
  signUpEmailErr = false,
  signUpEmailErr2 = false,
  signUpPasswordErr = false,
  height = false,
  weight = false,
  gender = false,
  birth = false;

const url =
  'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyAYRnraN167fSwfKHYoOWOGVA1GZcpWY58';

window.onload = () => {
  authCheckState();
};

function authCheckState() {
  const token = localStorage.getItem('token');
  if (token) {
    const expirationDate = new Date(localStorage.getItem('expirationDate'));
    if (expirationDate < new Date()) {
      return;
    } else {
      window.location.href = 'main.html';
    }
  }
}

function signup() {
  validity();
  firebase
    .auth()
    .createUserWithEmailAndPassword(signupEmail.value, signupPassword.value)
    .then(data => {
      let name = document.getElementById('signupName');
      let gender = document.getElementById('gender');
      let date = document.getElementById('date');
      let height = document.getElementById('height');
      let weight = document.getElementById('weight');
      var usersRef = firebase.database().ref(`users/${data.uid}`);

      usersRef
        .update({
          info: {
            name: name.value,
            gender: gender.value,
            date: date.value,
            height: height.value,
            weight: weight.value
          }
        })
        .then(() => {
          $('#message').html('Registration complete');
          $('#message').css('transform', 'translateY(0px)');
          signupEmail.value = '';
          signupPassword.value = '';
          name.value = '';
          gender.value = '';
          date.value = '';
          height.value = '';
          weight.value = '';
          setTimeout(
            () => $('#message').css('transform', 'translateY(-55px)'),
            4000
          );
          showLogin();
        });
    })
    .catch(function(err) {
      signUpError = true;
      $('#email-signup-error').css('display', 'inline');
      $('#password-signup-error').css('display', 'inline');
      if (err != null) {
        const errCode = err.code;

        if (errCode === 'auth/invalid-email') {
          $('#email-signup-error').html(
            'Invalid email address. Please try again.'
          );
          $('#addon-email-signup').addClass('addon-error');
          $('#signupEmail').addClass('input-error');
        }

        if (errCode === 'auth/weak-password') {
          $('#password-signup-error').html(
            'The password must be of minimum length 6 characters.'
          );
          $('#addon-password-signup').addClass('addon-error');
          $('#signupPassword').addClass('input-error');
        }

        if (errCode === 'auth/email-already-in-use') {
          $('#email-signup-error').html(
            'Email address is already in use. Please use another email.'
          );
          $('#addon-email-signup').addClass('addon-error');
          $('#signupEmail').addClass('input-error');
        }

        return;
      }
    });
}

function login() {
  const isChecked = $('#checkbox').is(':checked');

  const authData = {
    email: loginEmail.value,
    password: loginPassword.value,
    returnSecureToken: true
  };
  axios
    .post(url, authData)
    .then(res => {
      const expirationDate = new Date(
        new Date().getTime() + res.data.expiresIn * 1000
      );
      if (isChecked) {
        localStorage.setItem('token', res.data.idToken);
        localStorage.setItem('expirationDate', expirationDate);
      }
      localStorage.setItem('userId', res.data.localId);
      window.location.href = 'main.html';
    })
    .catch(err => {
      const errCode = err.response.data.error.message;
      error = true;

      $('#email-error').css('display', 'inline');
      $('#password-error').css('display', 'inline');

      if (err != null) {
        if (errCode === 'INVALID_EMAIL') {
          $('#loginEmail').addClass('input-error');
          $('#addon-email').addClass('addon-error');
          $('#email-error').html('Invalid email address. Please try again.');
        }

        if (errCode === 'INVALID_PASSWORD' || errCode === 'MISSING_PASSWORD') {
          $('#loginPassword').addClass('input-error');
          $('#addon-password').addClass('addon-error');
          $('#password-error').html('Invalid password. Please try again.');
        }

        if (errCode === 'EMAIL_NOT_FOUND') {
          $('#loginEmail').addClass('input-error');
          $('#addon-email').addClass('addon-error');
          $('#email-error').html('User not found. Please try again.');
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
      localStorage.removeItem('token');
      localStorage.removeItem('expirationDate');
      localStorage.removeItem('userId');
      document.location.href = 'login.html';
    })
    .catch(err => {
      alert(err);
    });
}

function forgetPassword() {
  const email = $('#forgetEmail').val();
  firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(() => {
      forgetInput.value = '';
      $('#message').html('Send link for reset password to your email');
      $('#message').css('transform', 'translateY(0px)');
      setTimeout(
        () => $('#message').css('transform', 'translateY(-55px)'),
        4000
      );

      showLogin();
    })
    .catch(err => {
      const errCode = err.code;
      error = true;

      $('#forgetEmail-error').css('display', 'inline');

      if (err != null) {
        if (errCode === 'auth/invalid-email') {
          $('#forgetEmail').addClass('input-error');
          $('#addon-forgetEmail').addClass('addon-error');
          $('#forgetEmail-error').html(
            'Invalid email address. Please try again.'
          );
        }

        if (errCode === 'auth/user-not-found') {
          $('#forgetEmail').addClass('input-error');
          $('#addon-forgetEmail').addClass('addon-error');
          $('#forgetEmail-error').html('User not found. Please try again.');
        }
        return;
      }
    });
}

function showLogin() {
  signupSection.style.display = 'none';
  loginSection.style.display = 'block';
  forgetPass.style.display = 'none';
  navSignup.style.display = 'block';
  navLogin.style.display = 'none';
  topic.innerHTML = 'Login';
}

function showSignup() {
  loginSection.style.display = 'none';
  signupSection.style.display = 'block';
  forgetPass.style.display = 'none';
  navSignup.style.display = 'none';
  navLogin.style.display = 'block';
  topic.innerHTML = 'Sign up';
}

function showForget() {
  forgetPass.style.display = 'block';
  loginSection.style.display = 'none';
  signupSection.style.display = 'none';
  topic.innerHTML = 'Forget Password?';
}

function handleError() {
  if (error) {
    $('#email-error').css('display', 'none');
    $('#password-error').css('display', 'none');
    $('#forgetEmail-error').css('display', 'none');

    $('#email-error').html('');
    $('#password-error').html('');
    $('#forgetEmail-error').html('');

    $('#addon-email').removeClass('addon-error');
    $('#loginEmail').removeClass('input-error');

    $('#addon-password').removeClass('addon-error');
    $('#loginPassword').removeClass('input-error');

    $('#addon-forgetEmail').removeClass('addon-error');
    $('#forgetEmail').removeClass('input-error');

    error = false;
  }
}

function handleEmailSignupError() {
  if (signUpError) {
    $('#email-signup-error').css('display', 'none');
    $('#email-signup-error').html('');
    $('#addon-email-signup').removeClass('addon-error');
    $('#signupEmail').removeClass('input-error');
  }
}

function handlePasswordSignupError() {
  if (signUpError) {
    $('#password-signup-error').css('display', 'none');
    $('#password-signup-error').html('');
    $('#addon-password-signup').removeClass('addon-error');
    $('#signupPassword').removeClass('input-error');
  }
}

function handleNameSignupError() {
  if (signUpError) {
    $('#name-signup-error').css('display', 'none');
    $('#name-signup-error').html('');
    $('#addon-name').removeClass('addon-error');
    $('#signupName').removeClass('input-error');
  }
}
function handleHeightError() {
  if (signUpError) {
    $('#height-error').css('display', 'none');
    $('#height-error').html('');
    $('#addon-height').removeClass('addon-error');
    $('#height').removeClass('input-error');
  }
}

function handleWeightError() {
  if (signUpError) {
    $('#weight-error').css('display', 'none');
    $('#weight-error').html('');
    $('#addon-weight').removeClass('addon-error');
    $('#weight').removeClass('input-error');
  }
}

function handleDateError() {
  if (signUpError) {
    $('#date-error').css('display', 'none');
    $('#date-error').html('');
    $('#addon-date').removeClass('addon-error');
    $('#date').removeClass('input-error');
  }
}

function handleGenderError() {
  if (signUpError) {
    $('#gender-error').css('display', 'none');
    $('#gender-error').html('');
    $('#addon-gender').removeClass('addon-error');
    $('#gender').removeClass('input-error');
  }
}

function validity() {
  if ($('#signupName').val() == '') {
    signUpError = true;
    signUpNameErr = true;
    $('#signupName').addClass('input-error');
    $('#addon-name').addClass('addon-error');
    $('#name-signup-error').css('display', 'inline');
    $('#name-signup-error').html('Please enter your name.');
  } else {
    signUpNameErr = false;
  }

  if (
    !emailRegex.test($('#signupEmail').val()) &&
    $('#signupEmail').val() === ''
  ) {
    signUpError = true;
    signUpEmailErr = true;
    $('#signupEmail').addClass('input-error');
    $('#addon-email-signup').addClass('addon-error');
    $('#email-signup-error').css('display', 'inline');
    $('#email-signup-error').html('Invalid email address. Please try again.');
  } else {
    signUpEmailErr = false;
  }

  if (!$('#signupEmail').val()) {
    signUpError = true;
    signUpEmailErr2 = true;
    $('#signupEmail').addClass('input-error');
    $('#addon-email-signup').addClass('addon-error');
    $('#email-signup-error').css('display', 'inline');
    $('#email-signup-error').html('Please enter your email address.');
  } else {
    signUpEmailErr2 = false;
  }

  if (!$('#signupPassword').val()) {
    signUpError = true;
    signUpPasswordErr = true;
    $('#signupPassword').addClass('input-error');
    $('#addon-password-signup').addClass('addon-error');
    $('#password-signup-error').css('display', 'inline');
    $('#password-signup-error').html('Please enter your password.');
  } else {
    signUpPasswordErr = false;
  }

  if (!$('#height').val()) {
    signUpError = true;
    height = true;
    $('#height').addClass('input-error');
    $('#addon-height').addClass('addon-error');
    $('#height-error').css('display', 'inline');
    $('#height-error').html('Please enter your height.');
  } else {
    height = false;
  }

  if (!$('#weight').val()) {
    signUpError = true;
    weight = true;
    $('#weight').addClass('input-error');
    $('#addon-weight').addClass('addon-error');
    $('#weight-error').css('display', 'inline');
    $('#weight-error').html('Please enter your height.');
  } else {
    weight = false;
  }

  if ($('#date').val().length === 0) {
    signUpError = true;
    birth = true;
    $('#date').addClass('input-error');
    $('#addon-date').addClass('addon-error');
    $('#date-error').css('display', 'inline');
    $('#date-error').html('Please choose your birthday.');
  } else {
    birth = false;
  }

  if (!$('#gender').val()) {
    signUpError = true;
    gender = true;
    $('#gender').addClass('input-error');
    $('#addon-gender').addClass('addon-error');
    $('#gender-error').css('display', 'inline');
    $('#gender-error').html('Please select your gender.');
  } else {
    gender = false;
  }

  if (signUpNameErr) {
    throw 'Input error';
  }
  if (signUpEmailErr) {
    throw 'Input error';
  }
  if (signUpEmailErr2) {
    throw 'Input error';
  }
  if (height) {
    throw 'Input error';
  }
  if (weight) {
    throw 'Input error';
  }
  if (gender) {
    throw 'Input error';
  }
  if (birth) {
    throw 'input error';
  }
  if (
    !(
      signUpNameErr &&
      signUpEmailErr &&
      signUpEmailErr2 &&
      signUpPasswordErr &&
      height &&
      weight &&
      gender &&
      birth
    )
  ) {
    signUpError = false;
  }
}
