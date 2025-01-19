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

// Reference Realtime Database
var db = firebase.firestore();

// Add event listener to the form
document.getElementById('register-form').addEventListener('submit', submitForm);

// Helper function to get element value
const getElementVal = (id) => {
    return document.getElementById(id).value;
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

    db.collection("users").add({
        email: email,
        password: password, // Remember to hash passwords in a real application
        otp: otp, // Store the generated OTP
        otpGeneratedAt: otp, // Store the timestamp when OTP is generated
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

const expirationTime = doc.data().expirationTime;
if (expirationTime.toMillis() < Date.now()) {
    console.log("OTP has expired");
} else {
    console.log("OTP is still valid");
}

const verifyOTP = (userId, inputOTP) => {
    db.collection("users").doc(userId).get()
        .then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                const storedOTP = userData.otp;
                const otpExpirationTime = userData.otpExpirationTime;

                // Check if the OTP matches
                if (inputOTP === storedOTP) {
                    const currentTimestamp = firebase.firestore.FieldValue.serverTimestamp();
                    if (currentTimestamp < otpExpirationTime) {
                        console.log("OTP is valid.");
                        // OTP is valid, proceed with login or other actions
                    } else {
                        console.log("OTP has expired.");
                        // Handle OTP expiration (show message, ask for a new OTP, etc.)
                    }
                } else {
                    console.log("Invalid OTP.");
                    // Handle invalid OTP (wrong OTP entered)
                }
            } else {
                console.log("User not found.");
            }
        })
        .catch((error) => {
            console.error("Error verifying OTP: ", error);
        });
};


