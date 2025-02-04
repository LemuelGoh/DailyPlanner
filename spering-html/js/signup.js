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
// END Show OTP form

// Show OTP form
function showPasswordRecoveryForm() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.add('hidden');
    document.getElementById('forget-password-form').classList.add('hidden');
    document.getElementById('otp-verification-form').classList.add('hidden');
    document.getElementById('password-recovery-form').classList.remove('hidden');
}
// END Show OTP form


// SendMail()
function sendMail(email, otp){
    var params = {
        to_name : (email),
        OTP : (otp)
    }
    // emailjs.send("service_es85yey", "template_g35cvdm", params).then(function(res){
    //     alert("OTP is succesful delivery!")
    // })
}
// END SendMail()

// ----------------------------------------------------------------------------------------
// Function to handle form submission of the register
function submitForm(e) {
    e.preventDefault();
    var email = getElementVal('register-email'); // Using helper function correctly
    var password = getElementVal('register-password'); // Using helper function correctly
    var repassword = getElementVal('re-register-password');
    
    if (password.length < 8) {
        alert("Password must be at least 8 characters long.");
        return; // Stop the function if password is too short
    }
    
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


// Add event listener to the form of the register
document.getElementById('register-submit-btn').addEventListener('click', submitForm);
// ----------------------------------------------------------------------------------------


// ----------------------------------------------------------------------------------------
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
// Function to check if the email already exists in Firestore
// ----------------------------------------------------------------------------------------


// ----------------------------------------------------------------------------------------
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
// Function to generate a random OTP
// ----------------------------------------------------------------------------------------


// ----------------------------------------------------------------------------------------
// Function to save login info in Firestore
const saveLoginInfo = (email, password) => {
    const otp = generateOTP(); // Generate the OTP
    const expirationTime = firebase.firestore.Timestamp.fromMillis(Date.now() + 10 * 60 * 1000);
    console.log(otp)

    db.collection("users").add({
        email: email,
        password: password, // Remember to hash passwords in a real application
        otp: otp, // Store the generated OTP
        otpGeneratedAt: firebase.firestore.FieldValue.serverTimestamp(), // Store the timestamp when OTP is generated
        otpExpirationTime: expirationTime,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        status: "Not Activated"
    })
    .then(() => {
        sendMail(email,otp);
        alert("Register Successful!");
    })
    .catch((error) => {
        alert("Error!", error);
    });
}
// Function to save login info in Firestore
// ----------------------------------------------------------------------------------------


// ----------------------------------------------------------------------------------------
//VERIFY OTP
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
                        db.collection("users").doc(userId).update({
                            status: "Activated"
                        })
                        localStorage.setItem('loggedInUser', email);
                        localStorage.setItem('loginStatus', 'loggedIn');
                        window.location.href = 'user.html';
                        // OTP is valid, proceed with login or other actions
                    } else {
                        console.log("OTP has expired.");
                        alert("OTP has expired.")
                        // Handle OTP expiration
                    }
                } else {
                    console.log("Invalid OTP.");
                    alert("Invalid OTP.")
                    // Handle invalid OTP
                }
            } 
            else {
                console.log("User not found.");
                alert("User not found.")
            }
        })
        .catch((error) => {
            console.error("Error verifying OTP: ", error);
        });
};
//VERIFY OTP


//GET OTP FROM OTP REGISTRATION FORM BUTTON
document.getElementById('otp-submit-btn').addEventListener('click', function (e) {
    e.preventDefault();
    
    // Get email and inputOTP from your form or context
    var email = getElementVal('register-email');
    const inputOTP = getElementVal('otp-input');
    // Call the verifyOTP function with the correct arguments
    verifyOTP(email, inputOTP);
});
//GET OTP
// ----------------------------------------------------------------------------------------


// ----------------------------------------------------------------------------------------
// LOGIN
document.getElementById("login-submit-btn").addEventListener('click', login);
function login(e) {
    e.preventDefault();

    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    if (!email || !password) {
        alert("Please enter both email and password.");
        return; // Stop further execution if fields are empty
    }

    // Query Firestore for the user by email
    db.collection("users").where("email", "==", email).get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                // Get the first document from the query result
                const doc = querySnapshot.docs[0];
                const userData = doc.data();
                const storedPassword = userData.password; // Assuming password is stored in plaintext (NOTE: should hash passwords in real apps)

                // Manually check if the entered password matches the stored password
                if (password === storedPassword) {
                    alert("Log In Successful!")
                    // Redirect to the desired page after login
                    if (email === "admin") {
                        window.location.href = 'admin.html';
                    } else {
                        localStorage.setItem('loggedInUser', userData.email);
                        localStorage.setItem('isLoggedIn', 'true');
                        window.location.href = 'user.html';
                    }

                } else {
                    console.log("Invalid password.");
                    alert("Invalid email or password.");
                }
            } else {
                console.log("No user document found!");
                alert("No user found with this email.");
            }
        })
        .catch((error) => {
            console.error("Error fetching user data: ", error);
            alert("Error fetching user data.");
        });
}
// END LOGIN
// ----------------------------------------------------------------------------------------


// LIMIT INPUT TO 6 INTEGER ONLY
document.getElementById('verification-code').addEventListener('input', function (e) {
    // Remove any non-digit characters
    e.target.value = e.target.value.replace(/\D/g, '');
  
    // Trim the input to a maximum length of 6
    if (e.target.value.length > 6) {
      e.target.value = e.target.value.slice(0, 6);
    }
  });
// LIMIT INPUT TO 6 INTEGER ONLY


// ----------------------------------------------------------------------------------------
// Request OTP at forget password
const sendOTP = () => {
    // Get the email input field
    var email = getElementVal('forget-email');
    db.collection("users").where("email", "==", email).get()
    .then((querySnapshot) => {
        if(!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userId = userDoc.id;

            // Genarate the new otp
            const otp = generateOTP();
            const expirationTime = firebase.firestore.Timestamp.fromMillis(Date.now() + 10 * 60 * 1000);
            db.collection("users").doc(userId).update({
                otp: otp,
                otpExpirationTime: expirationTime,
                otpGeneratedAt: firebase.firestore.FieldValue.serverTimestamp(),           }).then(() => {
                sendMail(email,otp);
                console.log(otp)
                alert("OTP had sent to your email.");
            }).catch((error) => {
                console.error("Error updating user data: ", error);
                alert("Error sending OTP. Please try again.");
            });
        }
        else {
            alert("User does not exist.");
        }
    })
    .catch((error) => {
        console.error("Error fetching user data: ", error);
        alert("Error checking user. Please try again.")
    });
};
// Request OTP at forget password


// Eventlistener of send otp button
document.getElementById("send-otp-btn").addEventListener('click', sendOTP);
// ----------------------------------------------------------------------------------------


// ----------------------------------------------------------------------------------------
//VERIFY OTP and reset password
const verifyOTPandreset = (email, inputOTP) => {
    // Step 1: Query the Firestore collection to find the document with the matching email
    db.collection("users").where("email", "==", email).get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                // Step 2: Get the userId (document ID) from the query result
                const userDoc = querySnapshot.docs[0];
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
                        showPasswordRecoveryForm();
                        // OTP is valid, proceed with login or other actions
                    } else {
                        console.log("OTP has expired.");
                        alert("OTP has expired.")
                        // Handle OTP expiration
                    }
                } else {
                    console.log("Invalid OTP.");
                    alert("Invalid OTP.")
                    // Handle invalid OTP
                }
            } 
            else {
                console.log("User not found.");
                alert("User not found.")
            }
        })
        .catch((error) => {
            console.error("Error verifying OTP: ", error);
        });
};
//VERIFY OTP and reset password


// Eventlistener of reset password button
document.getElementById("reset-password-btn").addEventListener('click', function(e){
    e.preventDefault();
    var email = getElementVal('forget-email');
    const resetOTP = getElementVal('verification-code');

    if (email.trim() === "") {
        alert("Please enter your email.");
        return;
    }

    if (resetOTP.trim() === "") {
        alert("Please enter the verification code.");
        return;
    }

    verifyOTPandreset(email,resetOTP);
});
// ----------------------------------------------------------------------------------------


// ----------------------------------------------------------------------------------------
// update new password after recovery password
const updatePassword = (email, newPassword) => {
    // Query the Firestore collection to find the document with the matching email
    db.collection("users").where("email", "==", email).get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                // Get the user document
                const userDoc = querySnapshot.docs[0];
                const userId = userDoc.id;
                const userData = userDoc.data();
                const email = userData.email;

                // Update the user's password in Firestore
                db.collection("users").doc(userId).update({
                    password: newPassword // Ensure you hash the password in a real application
                })
                .then(() => {
                    console.log("Password updated successfully.");
                    alert("Your password has been updated successfully.");
                    localStorage.setItem('loggedInUser', email);
                    localStorage.setItem('isLoggedIn', 'true');
                    // Redirect to login page or other actions
                    window.location.href = 'login.html';
                })
                .catch((error) => {
                    console.error("Error updating password: ", error);
                    alert("Error updating password.");
                });
            } else {
                console.log("User not found.");
                alert("User not found.");
            }
        })
        .catch((error) => {
            console.error("Error finding user: ", error);
            alert("Error finding user.");
        });
};
// update new password after recovery password

// setting the new password button
document.getElementById("set-newpassword-btn").addEventListener('click', function(e){
    e.preventDefault();
    var email = localStorage.getItem("loggedInUser");
    var newPassword = getElementVal("new-password");
    var renewPassword = getElementVal("re-new-password")
    
    if (newPassword.length < 8) {
        alert("Password must be at least 8 characters long.");
        return; // Stop the function if password is too short
    }

    if(newPassword !== renewPassword) {
        alert("Passwords do not match. Please re-enter the passwords.");
        return;
    }

    updatePassword(email,newPassword);
})
// setting the new password button
// ----------------------------------------------------------------------------------------
