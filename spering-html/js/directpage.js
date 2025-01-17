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
    
    // Set the profile widget content including the close and edit buttons
    profileWidget.innerHTML = `
    <p>Profile Information</p>
    <p>Name: John Doe</p>
    <p>Email: john@example.com</p>
    <div class="profile-header">
        <button class="close-button" id="close-profile-widget" class="close-btn">✖</button>
        <button class="close-button" id="edit-profile" class="edit-btn">✏️ Edit</button>
    </div>
    `;
    
    // Add event listener for the close button to hide the profile widget
    document.getElementById("close-profile-widget").addEventListener("click", function() {
        const profileWidget = document.getElementById("profile-widget");
        profileWidget.classList.add("hide");
    });
    
    // Add event listener for the edit button (for now, this just logs a message)
    document.getElementById("edit-profile").addEventListener("click", function() {
        alert("Edit button clicked! (This can be expanded for real editing functionality.)");
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

function fetchNotificationData() {
    const notificationWidget = document.getElementById("notification-widget");
    
    notificationWidget.innerHTML = `
        <p>Notification Preferences</p>
        <div class="setting-container">
            <div class="setting-option">
                <button class="setting-button">Email Notification</button>
                <label class="switch">
                    <input type="checkbox" id="email-notification">
                    <span class="slider"></span>
                </label>
            </div>
            <div class="setting-option">
                <button class="setting-button">In-App Alert</button>
                <label class="switch">
                    <input type="checkbox" id="in-app-alert">
                    <span class="slider"></span>
                </label>
            </div>
        </div>
        <div class="profile-header">
            <button class="close-button" id="close-notification-widget" class="close-btn">✖ Close</button>
        </div>
    `;

    document.getElementById("close-notification-widget").addEventListener("click", function() {
        const notificationWidget = document.getElementById("notification-widget");
        notificationWidget.classList.add("hide");
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
}
