const weekDisplay = document.getElementById("weekDisplay");
let currentDate = new Date();
const options = { year: "numeric", month: "long", day: "numeric" };

// Function to get the start and end dates of the current week
function getWeekRange(date) {
    const dayIndex = date.getDay();
    const startDate = new Date(date);
    startDate.setDate(date.getDate() - dayIndex);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    const formattedStartDate = startDate.toLocaleDateString('en-US', { day: "numeric" });
    const formattedEndDate = endDate.toLocaleDateString('en-US', options);
    return `${formattedStartDate} - ${formattedEndDate}`;
}

// Display the week range in the `weekDisplay` element
if (sessionStorage.getItem("storageRedirectDate")) {
    currentDate = new Date(`${sessionStorage.getItem("storageRedirectDate")} 16:00:00`);
    sessionStorage.removeItem("storageRedirectDate");
}
weekDisplay.textContent = getWeekRange(currentDate);
