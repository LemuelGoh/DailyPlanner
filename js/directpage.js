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

var email = localStorage.getItem("loggedInUser");

function redirectToUserPage() {
    window.location.href = "user.html"; // Redirects to user.html
}

function redirectToYearlyPage() {
    window.location.href = "year.html"; // Redirects to year.html
}

function redirectToDailyPage() {
    window.location.href = "day.html"; // Redirects to day.html
}

function redirectToWeeklyPage() {
    window.location.href = "week.html"; // Redirects to week.html
}

function redirectToQuote() {
    window.location.href = "quote.html"; // Redirects to week.html
}

function clearInput(inputId) {
    const inputElement = document.getElementById(inputId);
    if (inputElement) {
        inputElement.value = ""; // Clear the input field
        inputElement.focus(); // Set focus back to the input field (optional)
    }
}


// SUBSCRIPTION BUTTON------------------------------------------
document.getElementById("subscribe-btn").addEventListener("click", function() {
    const profileWidget = document.getElementById("profile-widget");
    profileWidget.classList.add("hide");
    const settingWidget = document.getElementById("setting-widget");
    settingWidget.classList.add("hide");
    const notificationWidget = document.getElementById("notification-widget");
    notificationWidget.classList.add("hide");
    const backupWidget = document.getElementById("backuprestore-widget");
    backupWidget.classList.add("hide");
    const contactWidget = document.getElementById("contactsupport-widget");
    contactWidget.classList.add("hide");
    const feedbackWidget = document.getElementById("feedback-widget");
    feedbackWidget.classList.add("hide");

    const subscriptionWidget = document.getElementById("subscription-widget");
    // Toggle the visibility of the profile widget
    subscriptionWidget.classList.toggle("hide");

});

document.getElementById("close-subscription-widget").addEventListener("click", function() {
    const subscriptionWidget = document.getElementById("subscription-widget");
    subscriptionWidget.classList.add("hide");
});
//---------------------------------------------------------------


// PROFILE BUTTON -------------------------------------------------------------
document.getElementById("profile-btn").addEventListener("click", function() {
    const settingWidget = document.getElementById("setting-widget");
    settingWidget.classList.add("hide");
    const subscriptionWidget = document.getElementById("subscription-widget");
    subscriptionWidget.classList.add("hide");
    const notificationWidget = document.getElementById("notification-widget");
    notificationWidget.classList.add("hide");
    const backupWidget = document.getElementById("backuprestore-widget");
    backupWidget.classList.add("hide");
    const contactWidget = document.getElementById("contactsupport-widget");
    contactWidget.classList.add("hide");
    const feedbackWidget = document.getElementById("feedback-widget");
    feedbackWidget.classList.add("hide");

    const profileWidget = document.getElementById("profile-widget");
    // Toggle the visibility of the profile widget
    profileWidget.classList.toggle("hide");
    
    // Fetch data if needed
    fetchProfileData();
});

function fetchProfileData() {
    const profileWidget = document.getElementById("profile-widget");
    var email = localStorage.getItem("loggedInUser");
    console.log(email);
    
    db.collection("profile").where("email", "==", email).get()
    .then((querySnapshot) => {
        if (!querySnapshot.empty) {
            const profile = querySnapshot.docs[0];
            const profileData = profile.data();
            const email = profileData.email;
            const username = profileData.username;

            // Set up the notification widget UI
            profileWidget.innerHTML = `
            <p>Profile Information</p>
            <p>Name:</p>
            <p>${username}</p>
            <p>Email:</p>
            <p> ${email}</p>
            <div class="profile-header">
                <button class="close-button" id="close-profile-widget" class="close-btn">✖</button>
                <button class="close-button" id="edit-profile" class="edit-btn">✏️ Edit</button>
            </div>
            `;

            // Add event listener to the close button
            document.getElementById("close-profile-widget").addEventListener("click", function() {
                profileWidget.classList.add("hide");
            });

            // Add event listener for the edit button (for now, this just logs a message)
            document.getElementById("edit-profile").addEventListener("click", function() {
                profileWidget.innerHTML = `
                <p>Editing Profile Information</p>
                <p>Name:</p>
                <input type="text" id="username-input" value="${username}">
                <p>Email:</p>
                <p> ${email}</p>
                <div class="profile-header">
                    <button class="close-button" id="close-profile-widget" class="close-btn">✖</button>
                    <button class="close-button" id="edit-profile" class="editdone-btn">✅ Done</button>
                </div>
                `;

                document.getElementById("close-profile-widget").addEventListener("click", function() {
                    profileWidget.classList.add("hide");
                });

                document.getElementById("edit-profile").addEventListener("click", function() {
                    db.collection("profile").where("email", "==", email).get()
                    .then((querySnapshot) => {
                        if (!querySnapshot.empty){
                            const profile = querySnapshot.docs[0];
                            const userId = profile.id;
                            const username = getElementVal('username-input');
    
                            db.collection("profile").doc(userId).update({
                                username: username
                            }).then(() =>{
                                console.log("Profile updated");
                                fetchProfileData();
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
                        console.error("Error getting documents: ", error);
                        alert("Error finding user. ");
                    })
                });
            });

        } else {
            console.log("No user settings found.");
            db.collection("profile").add({
                email: email,
                username: email,
            }).then(() => {
                console.log("Default Settings");
                fetchProfileData();
            })
            .catch((error) => {
                console.error("Error Adding Settings:", error);
            });
        }
    })
    .catch((error) => {
        console.error("Error fetching settings: ", error);
    });
}
// -------------------------------------------------------------------------------


// SETTING BUTTON -----------------------------------------------------------------
document.getElementById("settings-btn").addEventListener("click", function() {
    const profileWidget = document.getElementById("profile-widget");
    profileWidget.classList.add("hide");
    const subscriptionWidget = document.getElementById("subscription-widget");
    subscriptionWidget.classList.add("hide");
    const notificationWidget = document.getElementById("notification-widget");
    notificationWidget.classList.add("hide");
    const backupWidget = document.getElementById("backuprestore-widget");
    backupWidget.classList.add("hide");
    const contactWidget = document.getElementById("contactsupport-widget");
    contactWidget.classList.add("hide");
    const feedbackWidget = document.getElementById("feedback-widget");
    feedbackWidget.classList.add("hide");
    

    const settingWidget = document.getElementById("setting-widget");
    // Toggle the visibility of the profile widget
    settingWidget.classList.toggle("hide");
});

document.getElementById("close-setting-widget").addEventListener("click", function() {
    const settingWidget = document.getElementById("setting-widget");
    settingWidget.classList.add("hide");
});
// ----------------------------------------------------------------------------------


// NOTIFICATION BUTTON -------------------------------------------------------------------
document.getElementById("notification-preferences").addEventListener("click", function() {
    const notificationWidget = document.getElementById("notification-widget");
    // Toggle the visibility of the profile widget
    notificationWidget.classList.toggle("hide");
    
    // Fetch data if needed
    fetchNotificationData();
});

function fetchNotificationData(email) {
    const notificationWidget = document.getElementById("notification-widget");
    var email = localStorage.getItem("loggedInUser");

    // Fetch user settings from Firestore
    db.collection("settings").where("email", "==", email).get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                console.log(email)
                const settings = querySnapshot.docs[0];
                const settingsData = settings.data();
                const emailNotifications = settingsData.emailNotification;
                const inAppAlerts = settingsData.inAppAlert;

                // Set up the notification widget UI
                notificationWidget.innerHTML = `
                    <p>Notification Preferences</p>
                    <div class="setting-container">
                        <div class="setting-option">
                            <button class="setting-button">Email Notification</button>
                            <label class="switch">
                                <input type="checkbox" id="email-notification" ${emailNotifications ? 'checked' : ''}>
                                <span class="slider"></span>
                            </label>
                        </div>
                        <div class="setting-option">
                            <button class="setting-button">In-App Alert</button>
                            <label class="switch">
                                <input type="checkbox" id="in-app-alert" ${inAppAlerts ? 'checked' : ''}>
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>
                    <div class="profile-header">
                        <button class="close-button" id="close-notification-widget" class="close-btn">✖ Close</button>
                    </div>
                `;

                // Add event listener to the close button
                document.getElementById("close-notification-widget").addEventListener("click", function() {
                    notificationWidget.classList.add("hide");
                });

                // Add event listeners to toggle switches
                document.getElementById("email-notification").addEventListener("change", function() {
                    updateUserSetting(email, 'emailNotification', this.checked);
                });

                document.getElementById("in-app-alert").addEventListener("change", function() {
                    updateUserSetting(email, 'inAppAlert', this.checked);
                });

            } else {
                console.log("No user settings found.");
                db.collection("settings").add({
                    email: email,
                    emailNotification: false,
                    inAppAlert: false,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                }).then(() => {
                    console.log("Default Settings");
                    fetchNotificationData();
                })
                .catch((error) => {
                    console.error("Error Adding Settings:", error);
                });
            }
        })
        .catch((error) => {
            console.error("Error fetching settings: ", error);
        });
}

function updateUserSetting(email, settingType, value) {
    // Update user settings in Firestore
    db.collection("settings").where("email", "==", email).get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                const userId = userDoc.id;

                db.collection("settings").doc(userId).update({
                    [settingType]: value,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                })
                .then(() => {
                    console.log("User settings updated successfully!");
                })
                .catch((error) => {
                    console.error("Error updating settings: ", error);
                });
            }
        })
        .catch((error) => {
            console.error("Error fetching user data: ", error);
        });
}
// ----------------------------------------------------------------------------------------------


// BACKUP BUTTON -------------------------------------------------------------------------
// document.getElementById("backup-restore").addEventListener("click", function() {
//     const backupWidget = document.getElementById("backuprestore-widget");
//     // Toggle the visibility of the profile widget
//     backupWidget.classList.toggle("hide");
//     fetchBackupData();
// });
// 
// function fetchBackupData() {
//     const backupWidget = document.getElementById("backuprestore-widget");
    
//     backupWidget.innerHTML = `
//         <p>Manual Backup and Restore Options</p>
//         <div class="setting-container">
//             <div class="setting-option">
//                 <button class="setting-button" id="backup">Backup Now</button>
//             </div>
//             <div class="setting-option">
//                 <button class="setting-button" id="backup">Restore Now</button>
//             </div>
//         </div>
//         <div class="profile-header">
//             <button class="close-button" id="close-backuprestore-widget" class="close-btn">✖ Close</button>
//         </div>
//     `;

//     document.getElementById("close-backuprestore-widget").addEventListener("click", function() {
//         const backupWidget = document.getElementById("backuprestore-widget");
//         backupWidget.classList.add("hide");
//     });
// }
// BACKUP BUTTON -------------------------------------------------------------------------


// CONTACT SUPPORT BUTTON -------------------------------------------------------------------------
document.getElementById("contact-support").addEventListener("click", function() {
    const contactWidget = document.getElementById("contactsupport-widget");
    // Toggle the visibility of the profile widget
    contactWidget.classList.toggle("hide");
    fetchContactData();
});

function fetchContactData() {
    const contactWidget = document.getElementById("contactsupport-widget");
    
    contactWidget.innerHTML = `
        <p>Contact Us</p>
        <div class="setting-container">
            <div class="setting-option">
                <a href="mailto:planlah.official.my@gmail.com?subject=Hello! PlanLah&body=I am interested to your service.">
                    <button class="setting-button" id="backup">planlah.official.my@gmail.com</button>
                </a>
            </div>
            <div class="setting-option">
                <button class="setting-button" id="backup">+60-1234567890</button>
            </div>
        </div>
        <div class="profile-header">
            <button class="close-button" id="close-contactsupport-widget" class="close-btn">✖ Close</button>
        </div>
    `;

    document.getElementById("close-contactsupport-widget").addEventListener("click", function() {
        const contactWidget = document.getElementById("contactsupport-widget");
        contactWidget.classList.add("hide");
    });
}
// CONTACT SUPPORT BUTTON -------------------------------------------------------------------------


// FEEDBACK SUBMISSION BUTTON -------------------------------------------------------------------------
document.getElementById("feedback-submission").addEventListener("click", function() {
    const feedbackWidget = document.getElementById("feedback-widget");
    // Toggle the visibility of the profile widget
    feedbackWidget.classList.toggle("hide");
    
    fetchFeedbackData();
});

function fetchFeedbackData() {
    const feedbackWidget = document.getElementById("feedback-widget");
    
    feedbackWidget.innerHTML = `
    <p>Feedback:</p>
    <div class="setting-container">
        <div class="setting-option">
            <textarea id="feedback-input" class="feedback-input" placeholder="Enter your feedback here..."></textarea>
        </div>
    <div class="profile-header">
        <button class="close-button" id="close-feedback-widget" class="close-btn">✖ Close</button>
        <button class="close-button" id="submit-feedback">Submit Feedback</button>
    </div>
    `;

    document.getElementById("close-feedback-widget").addEventListener("click", function() {
        const feedbackWidget = document.getElementById("feedback-widget");
        feedbackWidget.classList.add("hide");
    });

    document.getElementById("submit-feedback").addEventListener("click", function() {
        var email = localStorage.getItem("loggedInUser");
        const feedback = getElementVal('feedback-input');

        db.collection("feedback").add({
            email: email,
            feedback: feedback,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            alert("Feedback Submitted Successfully");
            fetchFeedbackData();
        }).catch((error) => {
            console.error("Error submitting feedback: ", error);
            alert("Error submitting feedback.");
        });
    });
}
// FEEDBACK SUBMISSION BUTTON -------------------------------------------------------------------------


// LOGOUT BUTTON ----------------------------------------------------------------------------------------
document.getElementById("logout-btn").addEventListener('click', function() {
    localStorage.clear();
    console.log("User logged out successfully!");
    alert("Logged Out Successful")
    window.location.href = 'index.html';
});
// LOGOUT BUTTON ----------------------------------------------------------------------------------------

// DELETE ACCOUNT BUTTON ----------------------------------------------------------------------------------------
document.getElementById("delete-account").addEventListener("click", function () {
    var email = localStorage.getItem("loggedInUser");

    if (!email) {
        alert("No logged-in user found.");
        return;
    }

    // Check if there's an existing request with "Pending" status
    db.collection("requestrolll")
        .where("email", "==", email)
        .where("status", "==", "Pending")
        .get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                alert("You have already submitted a delete request. Please wait for approval.");
            } else {
                // Proceed with deletion request if no pending request exists
                const confirmDelete = confirm("Are you sure you want to request account deletion? This action cannot be undone.");

                if (confirmDelete) {
                    db.collection("requestrolll").add({
                        email: email,
                        requestdata: firebase.firestore.FieldValue.serverTimestamp(),
                        status: "Pending",
                    }).then(() => {
                        alert("Delete request submitted!");
                    }).catch((error) => {
                        console.error("Error submitting delete request: ", error);
                        alert("Error submitting delete request.");
                    });
                }
            }
        })
        .catch((error) => {
            console.error("Error checking delete request: ", error);
            alert("Failed to check existing requests. Please try again.");
        });
});
// DELETE ACCOUNT BUTTON ----------------------------------------------------------------------------------------


document.getElementById("subscribe-premium").addEventListener("click", async function() {
    const email = localStorage.getItem("loggedInUser"); // Get logged-in user email

    if (!email) {
        alert("No logged-in user found.");
        return;
    }

    try {
        // Find the user's document in Firestore
        const userRef = db.collection("users").where("email", "==", email);
        const userSnapshot = await userRef.get();

        if (!userSnapshot.empty) {
            const userDoc = userSnapshot.docs[0]; // Get the first document
            const userData = userDoc.data(); // Get user data
            // Check if the user is already premium
            if (userData.isPremium) {
                alert("You are already a premium user!");
                return; // Exit function
            }
            
            await userDoc.ref.update({ isPremium: true }); // Update the field
            alert("You are now a premium user!");
            window.location.reload(); // Refresh to apply changes
        } else {
            alert("User not found in database.");
        }
    } catch (error) {
        console.error("Error updating premium status:", error);
        alert("Failed to upgrade to premium. Please try again.");
    }
});

document.getElementById("subscribe-normal").addEventListener("click", async function() {
    const email = localStorage.getItem("loggedInUser"); // Get logged-in user email

    if (!email) {
        alert("No logged-in user found.");
        return;
    }

    try {
        // Find the user's document in Firestore
        const userRef = db.collection("users").where("email", "==", email);
        const userSnapshot = await userRef.get();

        if (!userSnapshot.empty) {
            const userDoc = userSnapshot.docs[0]; // Get the first document
            const userData = userDoc.data(); // Get user data

            // Check if the user is already a normal user
            if (!userData.isPremium) {
                alert("You are already a normal user!");
                return; // Exit function
            }

            // Update user to normal (isPremium: false)
            await userDoc.ref.update({ isPremium: false });

            alert("You have switched back to a normal user.");
            window.location.reload(); // Refresh to apply changes
        } else {
            alert("User not found in database.");
        }
    } catch (error) {
        console.error("Error updating premium status:", error);
        alert("Failed to switch to normal user. Please try again.");
    }
});