let auth = firebase.auth();

document.getElementById("forgotPasswordButton").addEventListener('click', e => {
    e.preventDefault();
    let emailAddress = document.getElementById("forgotPasswordEmail").value.trim().toString();
    if(emailAddress.length < 10)
        error("Enter correct email address");
    else{
        auth.sendPasswordResetEmail(emailAddress).then(function() {
            console.log("email sent");
            document.getElementById("error").className = "alert alert-success";
            error("Password reset Email sent successfully");
            setTimeout(function(){ document.getElementById("error").className = "alert alert-danger"}, 5000);
        }).catch(function(err) {
            if(err.code === "auth/invalid-email")
                error("Enter a valid Email address");
            else if(err.code === "auth/user-not-found" )
                error("This email is not registered with us");
            else
                error("Could not send passsword reset link")
        });
    }
});

error = Text => { 
    document.getElementById("error").innerText = Text;
    document.getElementById("error").style = "display:block; display:flex; justify-content:center;";
    setTimeout(function(){ document.getElementById("error").style.display = "none"; }, 5000);
}




