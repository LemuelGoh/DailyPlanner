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
document.getElementById("backup-restore").addEventListener("click", function() {
    const backupWidget = document.getElementById("backuprestore-widget");
    // Toggle the visibility of the profile widget
    backupWidget.classList.toggle("hide");
    fetchBackupData();
});

function fetchBackupData() {
    const backupWidget = document.getElementById("backuprestore-widget");
    
    backupWidget.innerHTML = `
        <p>Manual Backup and Restore Options</p>
        <div class="setting-container">
            <div class="setting-option">
                <button class="setting-button" id="backup">Backup Now</button>
            </div>
            <div class="setting-option">
                <button class="setting-button" id="backup">Restore Now</button>
            </div>
        </div>
        <div class="profile-header">
            <button class="close-button" id="close-backuprestore-widget" class="close-btn">✖ Close</button>
        </div>
    `;

    document.getElementById("close-backuprestore-widget").addEventListener("click", function() {
        const backupWidget = document.getElementById("backuprestore-widget");
        backupWidget.classList.add("hide");
    });
}
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


// ADD TASKS BUTTON ----------------------------------------------------------------------------------------
document.getElementById("add-tasks-btn").addEventListener("click", function() {
    const addtaskWidget = document.getElementById("addtask-widget");
    // Toggle the visibility of the profile widget
    addtaskWidget.classList.toggle("hide");
    addtask();
});

function addtask() {
    const addtaskWidget = document.getElementById("addtask-widget");

    addtaskWidget.innerHTML = `
    <div class="task-widget">
        <p>Add Task:</p>
        <div class="addtask-container">
            <div class="left-container" style="width: 60%; padding-right: 20px;">
                <div class="setting-option4">
                    <label for="task-title">Title:</label>
                    <input type="text" id="task-title" class="task-input" placeholder="Enter task title" />
                </div>
                <div class="setting-option4">
                    <label for="task-time">Time:</label>
                    <input type="time" id="task-time" class="task-input" step="3600" />
                </div>
                <div class="setting-option4">
                    <label for="task-category">Category:</label>
                    <input type="text" id="task-category" class="task-input" placeholder="Enter task category" />
                </div>
                <div class="setting-option4">
                    <label for="task-description">Description:</label>
                    <textarea id="task-description" class="task-input" placeholder="Enter task description"></textarea>
                </div>
                <div class="setting-option4">
                    <label for="task-date">Date:</label>
                    <input type="date" id="task-date" class="task-input" />
                </div>
            </div>
            <div class="right-container2" style="width: 40%;">
                <div class="setting-option3">
                    <label for="task-reminder">Reminder:</label>
                    <select id="task-reminder" class="task-input">
                        <option value="0">None</option>
                        <option value="15">15 mins</option>
                        <option value="30">30 mins</option>
                        <option value="45">45 mins</option>
                        <option value="60">60 mins</option>
                    </select>
                </div>
                <div class="setting-option3">
                    <label for="task-priority">Priority:</label>
                    <select id="task-priority" class="task-input">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <div class="setting-option3">
                    <label for="task-recurring">Task Recurring:</label>
                    <select id="task-recurring" class="task-input">
                        <option value="0">None</option>
                        <option value="1">Day</option>
                        <option value="7">Week</option>
                        <option value="30">Month</option>
                    </select>
                </div>
                <div class="setting-option3">
                    <label for="mark-as-done">Mark as Done:</label>
                    <input type="checkbox" id="mark-as-done" />
                </div>
                <div class="setting-option2">
                    <button id="close-addtask-widget" class="close-button" >Cancel</button>
                    <button id="save-button" class="close-button">Save</button>
                </div>
            </div>
        </div>
    </div>
    `;

    document.getElementById("close-addtask-widget").addEventListener("click", function() {
        const addtaskWidget = document.getElementById("addtask-widget");
        addtaskWidget.classList.add("hide");
    });

    document.getElementById("save-button").addEventListener("click", function() {
        var email = localStorage.getItem("loggedInUser");
        const title = getElementVal('task-title');
        const time = getElementVal('task-time');
        const category = getElementVal('task-category');
        const description = getElementVal('task-description');
        const date = getElementVal('task-date');
        const reminder = getElementVal('task-reminder');
        const priority = getElementVal('task-priority');
        const recurring = getElementVal('task-recurring');
        const markAsDone = document.getElementById('mark-as-done').checked;
        
        const taskData = {
            title: title,
            time: time,
            category: category,
            description: description,
            date: date,
            reminder: reminder,
            priority: priority,
            recurring: recurring,
            markAsDone: markAsDone,
            createdAt: firebase.firestore.FieldValue.serverTimestamp() 
        };
    

        db.collection("tasks").doc(email).collection("tasks").add(taskData)
        .then(() => {
            alert("Task Added Successfully");
            addtask();
        })
        .catch((error) => {
            alert("Error Adding Task");
            console.log("Error adding task: ", error);
        });
    });
}
// ADD TASKS BUTTON ----------------------------------------------------------------------------------------




document.getElementById("logout-btn").addEventListener('click', function() {
    localStorage.clear();
    console.log("User logged out successfully!");
    alert("Logged Out Successful")
    window.location.href = 'index.html';
});
