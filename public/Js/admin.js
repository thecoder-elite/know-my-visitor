let Files ='';
verified = "false"; 
let target;

window.onload = () => {

    target = document.getElementById('drag_drop_area');
    target.addEventListener('drop', (e) => {
    e.stopPropagation();
    e.preventDefault();
    doSomethingWithFiles(e.dataTransfer.files);
    });
    
    target.addEventListener('dragover', (e) => {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    document.getElementById("drag_drop_area").style.boxShadow = "2px 2px 8px 6px rgb(235, 233, 233)";
    });
    
    target.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        document.getElementById("file_input").click();
        document.getElementById("drag_drop_area").style.boxShadow = "2px 2px 8px 6px rgb(235, 233, 233)";
    });

    faceChecker();
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

let faceMatcher;
async function faceChecker(){
    
    await faceapi.loadSsdMobilenetv1Model('/models')   
    await faceapi.loadFaceLandmarkModel('/models')   
    await faceapi.loadFaceRecognitionModel('/models')
    const labels = ['Ayaan', 'John', 'WillSmith']

    const labeledFaceDescriptors = await Promise.all(
        labels.map(async label => {
            // fetch image data from urls and convert blob to HTMLImage element
            const imgUrl = `../img/${label}.jpg`
            const img = await faceapi.fetchImage(imgUrl)
            
            // detect the face with the highest score in the image and compute it's landmarks and face descriptor
            const fullFaceDescription = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
            
            if (!fullFaceDescription) {
                console.log(`no faces detected for ${label}`);
                return "not found";
            }
            
            const faceDescriptors = [fullFaceDescription.descriptor]
            return new faceapi.LabeledFaceDescriptors(label, faceDescriptors)
        })
    );

    const maxDescriptorDistance = 0.6
    faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, maxDescriptorDistance)
}

function checkUser(e){
    let image = document.getElementById('display_image');
    if(image.src != '../resources/plus.svg'){
        let promise = face(image);
        promise.then((res) => {
            console.log(res);
            let d = new Date();
            let da = d.getDate();
            if(da >0 && da<10)
                da = "0"+da;
            let date = d.getFullYear()+"-"+d.getMonth()+"-"+da;
            let time = d.getHours()+":"+d.getMinutes();
            document.getElementById("visit_Date").value = date
            document.getElementById("visit_time").value = time
            if(res != "unknown"){
                document.getElementById("visitor_name").value = res;
                document.getElementById("visit_reason").value = "Resident";
                document.getElementById("visit_loc").value = "self";
                verified = "true";
                document.getElementById("drag_drop_area").style.boxShadow = "2px 2px 8px 6px #5cd65c";
            }
            else{
                document.getElementById("drag_drop_area").style.boxShadow = "2px 2px 8px 6px #ff704d";
            }
        });  
    }
} 

async function face(input){
    let fullFaceDescriptions = await faceapi.detectAllFaces(input).withFaceLandmarks().withFaceDescriptors()
    const results = fullFaceDescriptions.map(fd => faceMatcher.findBestMatch(fd.descriptor))
    console.log(results);
    return results[0].label;
}

cancelUpload = () => {
    files = '';
    let image = document.getElementById('display_image');
    image.src = '../resources/plus.svg'; 
    document.getElementById("drag_drop_area").style.boxShadow = "2px 2px 8px 6px rgb(235, 233, 233)";
};

document.getElementById("uploadData").addEventListener('click',e =>  {uploadData(e)})


function uploadData (e){
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
                    "visit_to":visit_loc,
                    "verified":verified
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
}