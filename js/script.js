document.addEventListener("DOMContentLoaded", function () {
    const auth = document.getElementById("auth");
    const noAuth = document.getElementById("no-auth");

    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        auth.style.display = "block";
        noAuth.style.display = "none";
      } else {
        auth.style.display = "none";
        noAuth.style.display = "block";
      }
    });
  });