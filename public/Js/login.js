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
                    window.location.href = "Html/admin.html";
                else
                    window.location.href = "Html/Notifications.html";
                
            } else {
                // error("Error validating user");
            }
        }).catch(function(error) {
            // error("Error validating user");
        });
    } else {
        localStorage.setItem("username", '');
        console.log("user not signed in");
    }
});

function forgotButton(){
    document.getElementById("login").style.display = "none";
    document.getElementById("forgot").style.display = "block";
    document.getElementsByClassName("header")[0].innerHTML = "<h2>Forgot your password, <br>don't worry!</h2><p>Just enter your registered email id.</p>";
    }

function loginButton(){
    document.getElementById("forgot").style.display = "none";
    document.getElementById("login").style.display = "block";
    document.getElementsByClassName("header")[0].innerHTML = "<h2>Welcome to, KnowYourVisitor</h2><p>Have a better control over your visitors.</p>";
}

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



