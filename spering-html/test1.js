const firebaseConfig = {
    apiKey: "AIzaSyDvQKch6kMq9J8KffpuiogfDoaOUAk8aWo",
    authDomain: "planlah-16aef.firebaseapp.com",
    projectId: "planlah-16aef",
    storageBucket: "planlah-16aef.firebasestorage.app",
    messagingSenderId: "638721515088",
    appId: "1:638721515088:web:9f4208ac42875abcacfb55"
};



// INITIALIZE DATABASE
firebase.initializeApp(firebaseConfig);


// Reference Firestore Database
var db = firebase.firestore(firebase);




document.getElementById("save-settings-btn").addEventListener('click', function(e){
    e.preventDefault();
    const email = "chun@hotmail.com";
    var emailNotification = document.getElementById('email-notification').checked;
    var inAppAlert = document.getElementById('in-app-alert').checked;
    var timestamp = firebase.firestore.Timestamp.now(); // Get the current timestamp

    db.collection("settings").add({
        email: email,
        emailNotification: emailNotification,
        inAppAlert: inAppAlert,
        updatedAt: timestamp,
    }).then(() => {
        console.log("Settings updated successfully!");
    })
    .catch((error) => {
        console.error("Error updating settings: ", error);
    });
})