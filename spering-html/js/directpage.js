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

function clearInput(inputId) {
    const inputElement = document.getElementById(inputId);
    if (inputElement) {
        inputElement.value = ""; // Clear the input field
        inputElement.focus(); // Set focus back to the input field (optional)
    }
}
