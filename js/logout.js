document.addEventListener("DOMContentLoaded", function () {
    firebase.auth().onAuthStateChanged(function (user) {
      console.log("user", user);
      if (user) {
        firebase.auth().signOut();
      }else{
        window.location = "index.html";  
      }
    });
  });