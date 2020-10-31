const db = firebase.firestore();
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        var docRef = db.collection("users").doc(user.email);
        docRef.get().then(function(doc) {
            if (doc.exists) {
                let flatNo = doc.data().flatNo;
                console.log(flatNo);
                db.collection("visitors")
                .get()
                .then(function(querySnapshot) {
                    let data = '';
                    querySnapshot.forEach(function(doc) {
                        let userDetails = doc.data();
                        console.log(userDetails.visit_to);
                        if(userDetails.visit_to == flatNo){
                            data += displayData(userDetails);
                        }
                    });
                    document.getElementById("visitor_data_display").innerHTML = data;
                });

            } else {
                // doc.data() will be undefined in this case
                error("Error in loading data");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
     } 
    else {
        error("Sorry, unable to fetch visitor details!");
    }
});


function displayData(userDetails){
    let content ='';
    content+='<div class="visitor_info_display col-lg-4 col-md-12">';
    content=content+'<img src="'+userDetails.visitor_image+'" id="visitor_pic"/>';
    content=content+'<div>';
    content=content+' <p id="visitor_name">'+userDetails.visitor_name+'</p>';
    content=content+'<p id="visit_date">'+userDetails.visit_Date+'</p>';
    content=content+'<p id="visit_time">'+userDetails.visit_time+'</p>';
    content=content+'<p style="margin-bottom: 0px; color: rgba(230, 126, 34, 1);" class="class1">Reason for visit:</p>';
    content=content+'<p id="visit_reason">'+userDetails.visit_reason+'</p>';
    content=content+'<p style="margin-bottom: 0px; color: rgba(230, 126, 34, 1);" class="class1">visit to:</p>';
    content=content+'<p id="visit_to">'+userDetails.visit_to+'</p>';
    content+='</div><img src="resources/checkmark.svg" class="user_verification"/></div>';
    
    return content;
}


