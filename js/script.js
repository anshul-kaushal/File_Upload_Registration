function buttonSuccess(){
  if(document.getElementById("email").value === '' || document.getElementById("password").value === ''){
    document.getElementById("login").disabled = true;
  }
  else {
    document.getElementById("login").disabled = false;
  }
}

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

    const toggleButton = document.getElementById('toggle-no-auth');
    const navLinks = document.getElementById('nav-links');

    toggleButton.addEventListener("click", function () {
      navLinks.classList.toggle("active");
    })

    const toggleButtonAuth = document.getElementById('toggle-auth');
    const navLinksAuth = document.getElementById('nav-links-auth');

    toggleButtonAuth.addEventListener("click", function () {
      navLinksAuth.classList.toggle("active");
    })

    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const login = document.getElementById("login");

    login.addEventListener("click", function (event) {
      event.preventDefault()
      if (email.value && password.value) {
        firebase
          .auth()
          .signInWithEmailAndPassword(email.value, password.value)
          .then(function (data) {
            const user = firebase.auth().currentUser;
            console.log(user)
            console.log(data)
          })
          .catch(function (error) {
            console.error(error);
          });
      }
    });

    // firebase.auth().onAuthStateChanged(function (user) {
    //   if (user) {
    //     window.location = "index.html";
    //   }
    // });

    // console.log("Loaded!");
  
    const fileButton = document.getElementById("fileButton");
    const imageName = document.getElementById("imageName");
    const submit = document.getElementById("submit");
    const progress = document.getElementById("progress");
    const gallery = document.getElementById("gallery");
  
    const db = firebase.firestore();
  
    const fbFolder = "images";
  
    let file = "";
    let filename = "";
    let extension = "";
  
    fileButton.addEventListener("change", function (e) {
      file = e.target.files[0];
      filename = file.name.split(".").shift(); //"cat4"
      extension = file.name.split(".").pop(); //"jpg"
      imageName.value = filename;
    });
  
    submit.addEventListener("click", function (event) {
      event.preventDefault();
      if (imageName.value) {
        // Create a db id
        const id = db.collection("Images").doc().id;
  
        // Create a storage ref
        const storageRef = firebase
          .storage()
          .ref(`${fbFolder}/${id}.${extension}`);
  
        const uploadTask = storageRef.put(file);
  
        uploadTask.on(
          "state_changed",
          function (snapshot) {
            progress.value =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          },
          function (error) {
            console.error(error);
          },
          function () {
            console.log("done");
            uploadTask.snapshot.ref
              .getDownloadURL()
              .then(function (downloadURL) {
                db.collection("Images")
                  .doc(id)
                  .set({
                    name: imageName.value,
                    id,
                    image: downloadURL,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                  })
                  .then(function () {
                    console.log("Document successfully created!");
                    file = "";
                    filename = "";
                    extension = "";
                    imageName.value = "";
                    progress.value = "";
  
                    creatGallery();
                  })
                  .catch(function (error) {
                    console.error(error);
                  });
              })
              .catch(function (error) {
                console.error(error);
              });
          }
        );
      }
    });
  
    function creatGallery() {
      gallery.innerHTML = "";
  
      const listRef = firebase.storage().ref(fbFolder);
  
      listRef.listAll().then(function (res) {
        res.items.forEach((itemRef) => {
          itemRef.getDownloadURL().then(function (downlodURL) {
            const div = document.createElement("div");
            div.className = "gallery-image";
  
            const img = document.createElement("img");
            img.src = downlodURL;
            img.className = "image";
  
            const delImg = document.createElement("img");
            delImg.src = "img/delete.svg";
            delImg.className = "delete-icon";
            // const galleryContent  = `
            // <div class="gallery-image">
            // <img src="${downlodURL}" alt="gallery image">
            // <img src="img/" alt="delete image" id="delete-image" class="delete-image">
            // </div>
            // `

            delImg.addEventListener("click", function () {
              itemRef
                .delete()
                .then(function () {
                  console.log("Successfully deleted from storage");
                  db.collection("Images")
                    .doc(itemRef.name.split(".").shift())
                    .delete()
                    .then(function () {
                      console.log("Successfully deleted from db");
                      creatGallery()
                    })
                    .catch(function (error) {
                      console.error(error);
                    });
                })
                .catch(function (error) {
                  console.error(error);
                });
            });
  
            div.append(delImg);
            div.append(img);
            gallery.append(div);
          });
        });
      });
    }
  
    creatGallery();
  });