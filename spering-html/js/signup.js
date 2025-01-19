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


// Add event listener to the form
document.getElementById('register-submit-btn').addEventListener('click', submitForm);


// Helper function to get element value
const getElementVal = (id) => {
    return document.getElementById(id).value;
}


// Show OTP form
function showOTPVerificationForm() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.add('hidden');
    document.getElementById('forget-password-form').classList.add('hidden');
    document.getElementById('password-recovery-form').classList.add('hidden');
    document.getElementById('otp-verification-form').classList.remove('hidden');
}


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

    // Check if email already exists in Firestore
    checkIfEmailExists(email).then((exists) => {
        if (exists) {
            alert("Email is already registered. Please use a different email.");
        } else {
            // Save user login info to Firestore if email is not already registered
            saveLoginInfo(email, password);
            showOTPVerificationForm();
        }
    }).catch((error) => {
        console.error("Error checking email existence: ", error);
    });}


// Function to check if the email already exists in Firestore
const checkIfEmailExists = (email) => {
    return db.collection("users")
        .where("email", "==", email)  // Query to check for matching email
        .get()  // Get the results
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                console.log("Email does not exist in Firestore.");
                return false; // Email doesn't exist
            } else {
                console.log("Email already exists in Firestore.");
                return true; // Email exists
            }
        })
        .catch((error) => {
            console.error("Error checking email existence: ", error);
            return false; // Return false in case of error
        });
}


// Function to generate a random OTP
const generateOTP = () => {
    const otpLength = 6; // Length of OTP
    let otp = '';
    const characters = '0123456789'; // OTP will consist of digits
    for (let i = 0; i < otpLength; i++) {
        otp += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return otp;
};


// Function to save login info in Firestore
const saveLoginInfo = (email, password) => {
    const otp = generateOTP(); // Generate the OTP
    const expirationTime = firebase.firestore.Timestamp.fromMillis(Date.now() + 5 * 60 * 1000);
    console.log(otp)

    db.collection("users").add({
        email: email,
        password: password, // Remember to hash passwords in a real application
        otp: otp, // Store the generated OTP
        otpGeneratedAt: firebase.firestore.FieldValue.serverTimestamp(), // Store the timestamp when OTP is generated
        otpExpirationTime: expirationTime,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        alert("Register Successful!");
    })
    .catch((error) => {
        alert("Error!", error);
    });
}


const verifyOTP = (email, inputOTP) => {
    // Step 1: Query the Firestore collection to find the document with the matching email
    db.collection("users").where("email", "==", email).get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                // Step 2: Get the userId (document ID) from the query result
                const userDoc = querySnapshot.docs[0];
                const userId = userDoc.id;
                const userData = userDoc.data();
                const storedOTP = userData.otp;
                const otpExpirationTime = userData.otpExpirationTime;

                // Step 3: Verify the OTP
                if (inputOTP === storedOTP) {
                    const currentTimestamp = new Date().getTime(); // Use local timestamp
                    if (currentTimestamp < otpExpirationTime.toMillis()) {
                        console.log("OTP is valid.");
                        localStorage.setItem('loggedInUser', email);
                        localStorage.setItem('loginStatus', 'loggedIn');
                        window.location.href = 'user.html';
                        // OTP is valid, proceed with login or other actions
                    } else {
                        console.log("OTP has expired.");
                        // Handle OTP expiration
                    }
                } else {
                    console.log("Invalid OTP.");
                    // Handle invalid OTP
                }
            } else {
                console.log("User not found.");
            }
        })
        .catch((error) => {
            console.error("Error verifying OTP: ", error);
        });
};


// Assuming you have a form or button triggering the OTP verification
document.getElementById('otp-submit-btn').addEventListener('click', function (e) {
    e.preventDefault();
    
    // Get email and inputOTP from your form or context
    var email = getElementVal('register-email');
    const inputOTP = getElementVal('otp-input');
    // Call the verifyOTP function with the correct arguments
    verifyOTP(email, inputOTP);
});