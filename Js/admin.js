let Files ='';

window.onload = () => {
    const target = document.getElementById('drag_drop_area');
    target.addEventListener('drop', (e) => {
    e.stopPropagation();
    e.preventDefault();
    doSomethingWithFiles(e.dataTransfer.files);
    });
    
    target.addEventListener('dragover', (e) => {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    });
    
    target.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        document.getElementById("file_input").click();
    });
}

function loadFile(event){
    event.stopPropagation();
    event.preventDefault();
    doSomethingWithFiles(event.target.files);
}

function doSomethingWithFiles(files) {
    console.log(files[0]);
    Files = files[0];
    let image = document.getElementById('display_image');
    image.src = URL.createObjectURL(Files)
    document.getElementById('display_image').style.display = "block";
}

cancelUpload = () => {
    files = '';
    let image = document.getElementById('display_image');
    image.src = 'resources/plus.svg'; 
};

document.getElementById("uploadData").addEventListener('click', e => {
    e.preventDefault();
    const db = firebase.firestore();
    const storageRef = firebase.storage().ref();

    let visitor_name = document.getElementById("visitor_name").value;
    let visit_reason = document.getElementById("visit_reason").value;
    let visit_loc = document.getElementById("visit_loc").value;
    let visit_time = document.getElementById("visit_time").value;
    let visit_Date = document.getElementById("visit_Date").value;

    if(visitor_name.length < 5)
        error("Enter a valid visitor name")
    else if(visit_reason.length < 5)
        error("Enter a valid visit reason")
    else if(visit_loc.length != 4 && visit_loc >= 1101 && visit_loc<=4704)
        error("Enter a valid flat no")
    else if(visit_time.length == '')
        error("Enter a valid time")
    else if(visit_Date.length == '')
        error("Enter a valid date")
    else if(Files.size < 10)
        error("Please upload a image first");
    else{

        var uploadTask = storageRef.child(Files.name).put(Files);
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function(snapshot) {}, function(error) {}, function() {
            // Upload completed successfully, now we can get the download URL
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
              console.log('File available at', downloadURL);
              // Add a new document in collection "cities"
                db.collection("visitors").doc(visit_Date+" "+visit_time).set({
                    "visitor_name": visitor_name,
                    "visit_reason":visit_reason,
                    "visit_Date":visit_Date,
                    "visit_time":visit_time,
                    "visitor_image":downloadURL,
                    'visit_to':visit_loc
                })
                .then(function() {
                    document.getElementById("error").className = "alert alert-success";
                    error("visitor registered successfully");
                    setTimeout(function(){ 
                        document.getElementById("error").className = "alert alert-danger"; 
                        window.location.href="admin.html";
                    }, 5000);
                })
                .catch(function(error) {
                    console.error("Error writing document: ", error);
                    error("Unable to register visitor");
                });
            });
          });
    }
})
