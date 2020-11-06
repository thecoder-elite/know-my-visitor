window.onload = () => {
    let user_type_chart = document.getElementById('visitors-type-chart').getContext('2d');
    let user_count_chart = document.getElementById('visitor-count-chart').getContext('2d');

    db.collection("visitors")
    .get()
    .then(function(querySnapshot) {
        let arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        querySnapshot.forEach(function(doc) {
            let x = doc.id.split("-")[1];
            arr[x-1]+=1;
        });
        let chart1 = new Chart(user_type_chart, {
            // The type of chart we want to create
            type: 'line',
        
            // The data for our dataset
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Total no of Visitors',
                    backgroundColor: 'rgba(255, 255, 255, 0)',
                    borderColor: 'rgba(230, 126, 34, 1)',
                    data: arr
                }]
            },
            // Configuration options go here
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            steps: 10,
                            stepValue: 2,
                            max: 20
                        }
                    }]
                }
            }
        });

    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });


    db.collection("visitors").where("verified", "==", "true")
    .get()
    .then(function(querySnapshot) {
        let count1=0;
        let count2=0;
        querySnapshot.forEach(function(doc) {
            count1+=1;
        });
        db.collection("visitors").where("verified", "==", "false")
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                count2+=1;
            });       
            console.log(count1);
            console.log(count2);
            let chart2 = new Chart(user_count_chart, {
                // The type of chart we want to create
                type: 'bar',
            
                // The data for our dataset
                data: {
                    labels: ['Known Visitor', 'Unknown Visitor'],
                    datasets: [{
                        label: 'Visitor count',
                        backgroundColor: 'rgba(230, 126, 34, 1)',
                        borderColor: 'rgba(230, 126, 34, 1)',
                        data: [count1, count2]
                    }]
                },
            
                // Configuration options go here
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                steps: 10,
                                stepValue: 2,
                                max: 20
                            }
                        }]
                    }
                }
            });
       
        });
       
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

}

document.getElementById('searchButton').addEventListener('click', e => {
    e.preventDefault();
    let sdate = document.getElementById('start_date').value;
    let edate = document.getElementById('end_date').value;
    getData(sdate, edate);
})

const db = firebase.firestore();
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        getData(-1, -1);
     } 
    else {
        error("Sorry, unable to fetch visitor details!");
    }
});

function getData(sdate, edate){
    document.getElementById("visitor_data_display").innerHTML = '';
    if(sdate == -1 && edate==-1){
        db.collection("visitors").get().then(function(querySnapshot) {
            let data = ''
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                
                let userDetails = doc.data();
                data += displayData(userDetails);
            });
            document.getElementById("visitor_data_display").innerHTML = data;
        });
    }
    else{
        
        db.collection("visitors").get().then(function(querySnapshot) {
            let data ='';
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                let userDetails = doc.data();
                let d = Date.parse(userDetails.visit_Date);
                console.log(Date.parse(edate) - d);
                if(d - Date.parse(sdate) > 0 && Date.parse(edate) - d > 0){
                    data += displayData(userDetails);
                }
            });
            document.getElementById("visitor_data_display").innerHTML = data;
        });
    }
}

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
    if(userDetails.verified == "true")
        content+='</div><img src="../resources/checkmark.svg" class="user_verification"/></div>';
    else    
        content+='</div><img src="../resources/warning.svg" class="user_verification"/></div>';
    return content;
}


