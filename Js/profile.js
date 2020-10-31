const db = firebase.firestore();
let email;
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        email = user.email;
        console.log(email)
        let docRef = db.collection("users").doc(email);
    
        docRef.get().then(function(doc) {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                let userDetails = doc.data();
                let data = ''
                data = displayData(userDetails);
                userDetails.relatives.forEach(element => {
                    data+=displayData(element);
                });
                document.getElementById("classContainer").innerHTML = data;
            
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
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
    content=content+'<p style="grid-row: 1 /2 ; grid-column: 2/3;">'+userDetails.relation +'</p>';
    content=content+'<p>Age: </p>';
    content=content+'<p>'+userDetails.age+'</p>';
    content=content+'<p>Contact: </p>';
    content=content+'<p>'+userDetails.phone+'</p>';
    content=content+'<p>Email: </p>';
    content=content+'<p>'+userDetails.email+'</p>';
    content=content+'<p>Flat no: </p>';
    content=content+'<p>'+userDetails.flatNo+'</p>';
    content=content+'</div>';
    content=content+'</div>';
    content += '</div>';
    
    return content;
}

