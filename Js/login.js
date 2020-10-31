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


const db = firebase.firestore();
const localStorage = window.localStorage;
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        localStorage.setItem("username", user.email);
        console.log("user signed in");
        var docRef = db.collection("users").doc("admin");
        docRef.get().then(function(doc) {
            if (doc.exists) {
                if(doc.data().usernames.includes(user.email))
                    window.location.href = "admin.html";
                else
                    window.location.href = "Notifications.html";
                
            } else {
                error("Error validating user");
            }
        }).catch(function(error) {
            error("Error validating user");
        });
    } else {
        localStorage.setItem("username", '');
        console.log("user not signed in");
    }
});

function forgotButton(){
    document.getElementById("login").style.display = "none";
    document.getElementById("forgot").style.display = "block";
}

function loginButton(){
    document.getElementById("forgot").style.display = "none";
    document.getElementById("login").style.display = "block";
}

document.getElementById("login_select").addEventListener('click', () => {
    document.getElementById("login_select").style = "background-color: rgba(230, 126, 34, 1); color:white";
    document.getElementById("forgot_select").style = " border: 1px solid rgba(230, 126, 34, 1); color: rgba(230, 126, 34, 1); background-color: white;";
})

document.getElementById("forgot_select").addEventListener('click', () => {
    document.getElementById("forgot_select").style = "background-color: rgba(230, 126, 34, 1); color:white";
    document.getElementById("login_select").style = " border: 1px solid rgba(230, 126, 34, 1); color: rgba(230, 126, 34, 1); background-color: white;";
})

document.getElementById("loginUser").addEventListener('click', e => {
    e.preventDefault();
    let email = document.getElementById("user_email").value.trim().toString();
    let password = document.getElementById("user_password").value.trim().toString();
    if(email.length < 10)
        error("Enter a valid email");
    else if(password.length < 6)
        error("password should have 6 character");
    else{
        firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(function(err) {
            // Handle Errors here.
            var errorCode = err.code;
            if(errorCode === "auth/invalid-email")
                error("Enter a valid Email address");
            else if(errorCode === "auth/user-not-found" )
                error("This email is not registered with us");
            else if(errorCode === "auth/wrong-password")
                error("You've entered a wrong password");
            else
                error("Unable to login")
            // ...
          });
    }
})

error = Text => { 
    document.getElementById("error").innerText = Text;
    document.getElementById("error").style = "display:block; display:flex; justify-content:center;";
    setTimeout(function(){ document.getElementById("error").style.display = "none"; }, 3000);
}



