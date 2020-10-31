const db = firebase.firestore();
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        db.collection("users")
        .where("relation", "==", "owner")
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                let userDetails = doc.data();
                let data = displayData(userDetails);
                document.getElementById("userContainer").innerHTML = data;
            });
        });
     } 
    else {
        error("Sorry, unable to fetch your details!");
    }
});



function displayData(userDetails){
    let content ='';
    content+='<div class="card">';
    content=content+'<img src="'+userDetails.imageURL+'" class="card-img-top" alt="user profile">';
    content=content+'<div class="card-body">';
    content=content+'<h3 class="card-title" style="font-weight: 700;">'+userDetails.name+'</h5>';
    content=content+'<div class="card-text">';
    content=content+'<p style="grid-row: 1 /2 ; grid-column: 1/2;">Relation: </p>';
    content=content+'<p style="grid-row: 1 /2 ; grid-column: 2/3;">'+userDetails.relation+'</p>';
    content=content+'<p>Age: </p>';
    content=content+'<p>'+userDetails.age+'</p>';
    content=content+'<p>Contact: </p>';
    content=content+'<p>'+userDetails.phone+'</p>';
    content=content+'<p>Email: </p>';
    content=content+'<p>'+userDetails.email+'</p>';
    content=content+'<p>Flat no: </p>';
    content=content+'<p>'+userDetails.flatNo+'</p>';
    content=content+'</div>';
    content=content+'<a href="#" class="btn btn-primary" style="margin: 3px;">Edit profile</a>';
    content=content+'<a href="#" class="btn btn-outline-primary" onclick="deleteUser()" style="margin: 3px;">Delete User</a>';
    content=content+'</div>';
    content += '</div>';
    
    return content;
}


function deleteUser(){
    let text = window.prompt("Enter email of user to delete!");
    if(text.length <10)
        error("Enter valid email");
    else{
        db.collection("users").doc().delete().then(function() {
            document.getElementById("error").className = "alert alert-success";
            error("Password reset Email sent successfully");
            setTimeout(function(){ 
                document.getElementById("error").className = "alert alert-danger";
                window.location.href = "user_relation.html"
            }, 5000);
        }).catch(function(error) {
            error("Cannot delete user");
        });
    }
    
}