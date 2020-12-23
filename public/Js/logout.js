var firebaseConfig = {
    // add your details accordingly
    apiKey: "__________",
    authDomain: "__________",
    databaseURL: "__________",
    projectId: "__________",
    storageBucket: "__________",
    messagingSenderId: "__________",
    appId: "__________"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log("user signed in");
     } 
    else {
        localStorage.setItem("username", '');
        console.log("user not signed in");
        window.location.href = "../index.html";
    }
});


document.getElementById('logoutButton').addEventListener('click', () => {
    firebase.auth().signOut().then(function() {
        console.log('logout success');
    }).catch(function(error) {
        error("Error logging Out");
    });
});



error = Text => {  
    document.getElementById("error").style = "width: 60%;display: flex;justify-content: center;align-items: center;position: absolute;left:20%;display: none;";
    document.getElementById("error").innerText = Text;
    document.getElementById("error").style = "display:block; display:flex; justify-content:center;";
    setTimeout(function(){ document.getElementById("error").style.display = "none"; }, 3000);
}
