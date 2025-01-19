const firebaseConfig = {
    apiKey: "AIzaSyBWjAORM7PQcajmL_WW2CU0DjbkycssMU4",
    authDomain: "dailyplannertest.firebaseapp.com",
    databaseURL: "https://dailyplannertest-default-rtdb.firebaseio.com",
    projectId: "dailyplannertest",
    storageBucket: "dailyplannertest.firebasestorage.app",
    messagingSenderId: "323718535688",
    appId: "1:323718535688:web:2ad12a1dcbfd1627358fbd"
  };


// INITIALIZE DATABASE
firebase.initializeApp(firebaseConfig);

// Reference Realtime Database
var db = firebase.firestore();

// Add event listener to the form
document.getElementById('register-form').addEventListener('submit', submitForm);

// Function to handle form submission
function submitForm(e) {
    e.preventDefault();
    var email = getElementVal('register-email'); // Using helper function correctly
    var password = getElementVal('register-password'); // Using helper function correctly
    var repassword = getElementVal('re-register-password');

    if (password !== repassword) {
        alert("Passwords do not match. Please re-enter the passwords.");
        return; // Stop the function if passwords don't match
    }

    saveLoginInfo(email, password);
    // console.log(email, password);
}

// Function to save login info in Firestore
const saveLoginInfo = (email, password) => {
    db.collection("users").add({
        email: email,
        password: password, // Remember to hash passwords in a real application
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        console.log("User login info saved to Firestore.");
    })
    .catch((error) => {
        console.error("Error saving user login info: ", error);
    });
}

// Helper function to get element value
const getElementVal = (id) => {
    return document.getElementById(id).value;
}

