function buttonSuccess(){
  if(document.getElementById("firstname").value === '' || document.getElementById("lastname").value === ''){
    document.getElementById("update").disabled = true;
  }
  else {
    document.getElementById("update").disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", function () {
    const firstname = document.getElementById("firstname");
    const lastname = document.getElementById("lastname");
    const update = document.getElementById("update");

    const db = firebase.firestore();

    let userRef = null;

    const toggleButton = document.getElementById('toggle-account');
    const navLinks = document.getElementById('nav-links-account');

    toggleButton.addEventListener("click", function () {
      navLinks.classList.toggle("active");
    })

    update.addEventListener("click", function (event) {
      event.preventDefault()
      if (firstname.value && lastname.value) {
        updateUser(userRef.uid, firstname.value, lastname.value);
      }
    });

    function updateUser(uid, first, last) {
      const p = document.getElementById('account-text');
      db.collection("Users")
        .doc(uid)
        .update({
          firstname: first,
          lastname: last,
        })
        .then(function () {
          p.style.display = "block"
          p.innerHTML = `User updated. Upload files <a href="index.html">here</a>`
          console.log("User updated!");
        })
        .catch(function (error) {
          p.style.display = "block"
          p.innerHTML = `${error}`
          console.error(error);
        });
    }

    function getUser(uid) {
      const p = document.getElementById('account-text');
      db.collection("Users")
        .doc(uid)
        .get()
        .then(function (doc) {
          firstname.value = doc.data().firstname;
          lastname.value = doc.data().lastname;
        })
        .catch(function (error) {
          p.style.display = "block"
          p.innerHTML =  `${error}`
          console.error(error);
        });
    }

    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        userRef = user;
        getUser(user.uid);
      } else {
        window.location = "login.html";
      }
    });
  });