document.addEventListener("DOMContentLoaded", function () {
    const firstname = document.getElementById("firstname");
    const lastname = document.getElementById("lastname");
    const update = document.getElementById("update");

    const db = firebase.firestore();

    let userRef = null;

    update.addEventListener("click", function () {
      if (firstname.value && lastname.value) {
        updateUser(userRef.uid, firstname.value, lastname.value);
      }
    });

    function updateUser(uid, first, last) {
      db.collection("Users")
        .doc(uid)
        .update({
          firstname: first,
          lastname: last,
        })
        .then(function () {
          console.log("User updated!");
        })
        .catch(function (error) {
          console.error(error);
        });
    }

    function getUser(uid) {
      db.collection("Users")
        .doc(uid)
        .get()
        .then(function (doc) {
          firstname.value = doc.data().firstname;
          lastname.value = doc.data().lastname;
        })
        .catch(function (error) {
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