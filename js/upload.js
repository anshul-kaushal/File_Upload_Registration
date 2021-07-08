document.addEventListener("DOMContentLoaded", function () {
    console.log("Loaded!");
  
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
  
    submit.addEventListener("click", function () {
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
            div.className = "img_wrapper";
  
            const img = document.createElement("img");
            img.src = downlodURL;
            img.width = 200;
            img.height = 200;
  
            const span = document.createElement("span");
            span.innerHTML = "x";
            span.className = "delete_icon";
            span.addEventListener("click", function () {
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
  
            div.append(span);
            div.append(img);
            gallery.append(div);
          });
        });
      });
    }
  
    creatGallery();
  });