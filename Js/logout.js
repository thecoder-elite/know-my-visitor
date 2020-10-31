var firebaseConfig = {
    apiKey: "AIzaSyAkuwGjGSZ4MI29W5Uza7wrsoz5qZswlHk",
    authDomain: "know-my-visitor.firebaseapp.com",
    databaseURL: "https://know-my-visitor.firebaseio.com",
    projectId: "know-my-visitor",
    storageBucket: "know-my-visitor.appspot.com",
    messagingSenderId: "907741984710",
    appId: "1:907741984710:web:29b5c1ec55f65688ab24c7"
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
        window.location.href = "login.html";
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
