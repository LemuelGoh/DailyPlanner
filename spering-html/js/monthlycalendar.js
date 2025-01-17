//init firebase
// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
// import { getFirestore, collection,getDocs,query,where } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// const firebaseConfig = {
//   apiKey: "AIzaSyBkBwCTHw56P2qs1n_Yl4HVVNhf0wNx1XM",
//   authDomain: "project-daily-planner.firebaseapp.com",
//   projectId: "project-daily-planner",
//   storageBucket: "project-daily-planner.firebasestorage.app",
//   messagingSenderId: "341596285306",
//   appId: "1:341596285306:web:90197e8c4b3bcc181ecec3",
//   measurementId: "G-LDCB4F40NF"
// };
// const app = initializeApp(firebaseConfig);
// const firestore = getFirestore(app);
//-------------

//check if user logged in
// if(!localStorage.getItem("user")) {
//     alert("Please Log In before using the calendar!");
//     window.location.href = "login.html";
// }
//--------------

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

const monthlyCalendarContainer = document.getElementById("monthlyCalendarContainer");
const monthDisplay = document.getElementById("monthDisplay");

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const tasksDate = [{month:-1,day:-1,year:-1,repeat:-1}];


function generateMonth(year, month) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const filterYrMnth = tasksDate.filter(t => (t.year === year && t.month === month + 1) || t.repeat === "daily" || t.repeat === "monthly" || (t.month === month + 1 && t.repeat === "yearly"));
    
    const monthDiv = document.createElement("div");
    monthDiv.className = "month-year";

    // Day names row
    const daysDiv = document.createElement("div");
    daysDiv.className = "days";


    // Empty spaces before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.className = "emptyCell";
        daysDiv.appendChild(emptyCell);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const container = document.createElement("div");
        container.className = "dayContainer";
        const dayDiv = document.createElement("div");
        dayDiv.className = "day";
        dayDiv.textContent = day;
        const tasksAmountDiv = document.createElement("div");
        tasksAmountDiv.className = "tasksAmount";
        tasksAmountDiv.textContent = "task";

        container.appendChild(dayDiv);
        container.appendChild(tasksAmountDiv);
        daysDiv.appendChild(container);
    }

    monthDiv.appendChild(daysDiv);
    return monthDiv;
}

function generateMonthCalendar(year, month) {
    monthlyCalendarContainer.innerHTML = ""; // Clear old monthly calendar
    const monthCalendar = generateMonth(year, month);
    monthlyCalendarContainer.appendChild(monthCalendar);
    monthDisplay.textContent = `${monthNames[month]}, ${year}`;
    addDaysEventListener();
}

function changeMonth(offset) {
    currentMonth += offset;

    // Adjust year if month overflows
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    generateMonthCalendar(currentYear, currentMonth);
    addDaysEventListener();
}


generateMonthCalendar(currentYear, currentMonth);
addDaysEventListener();

document.getElementById("prevMonth").addEventListener("click", () => {
    changeMonth(-1);
});

document.getElementById("nextMonth").addEventListener("click", () => {
    changeMonth(1);
});


function addDaysEventListener() {
    const dayContainers = document.getElementsByClassName("dayContainer");
    for (let i = 0; i < dayContainers.length; i++) {
        const dayContainer = dayContainers[i];
        dayContainer.addEventListener("click", () => {
            const dayDiv = dayContainer.querySelector(".day");
            const dayText = dayDiv.textContent;
            const month = monthNames[currentMonth];
            const redirectDate = `${month} ${dayText}, ${currentYear}`;
            sessionStorage.setItem("storageRedirectDate", redirectDate);
            window.location.href = "day.html";
        });
    }
}
