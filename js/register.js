function buttonSuccess(){
  if(document.getElementById("firstname").value === '' || document.getElementById("lastname").value === '' || document.getElementById("email").value === '' || document.getElementById("password").value === ''){
    document.getElementById("register").disabled = true;
  }
  else {
    document.getElementById("register").disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", function () {
    const firstname = document.getElementById("firstname");
    const lastname = document.getElementById("lastname");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const register = document.getElementById("register");

    const db = firebase.firestore();

    const toggleButton = document.getElementById('toggle-register');
    const navLinks = document.getElementById('nav-links-register');

    toggleButton.addEventListener("click", function () {
      navLinks.classList.toggle("active");
    })



    function addUser(uid, first, last) {
      db.collection("Users")
        .doc(uid)
        .set({
          firstname: first,
          lastname: last,
          user: uid,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(function () {
          document.getElementById("registration-text").style.display = "block"
          document.getElementById("registration-text").innerHTML = `Registeration successful. Upload <a class="registration-text-link" href="index.html">here</a>`
          console.log("User added to database!");
        })
        .catch(function (error) {
          document.getElementById("registration-text").style.display = "block"
          document.getElementById("registration-text").innerHTML = `${error}`;
          console.error(error);
        });
    }

    register.addEventListener("click", function (event) {
      event.preventDefault();
      if (email.value && password.value) {
        firebase
          .auth()
          .createUserWithEmailAndPassword(email.value, password.value)
          .then(function (data) {
            const user = firebase.auth().currentUser;

            addUser(user.uid, firstname.value, lastname.value);
          })
          .catch(function (error) {
            document.getElementById("registration-text").style.display = "block"
            document.getElementById("registration-text").innerHTML = `${error}`;
            console.error(error);
          });
      }
    });
  });