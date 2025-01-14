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

// Fetch data from firestore (simulated here)
async function initTasksDate() {
    // Simulate task data, replace with actual Firestore fetching
    tasksDate.push({ month: 1, day: 15, year: 2025, repeat: "daily" });
    tasksDate.push({ month: 2, day: 25, year: 2025, repeat: "monthly" });
}

 function generateMonth(year, month) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const filterYrMnth = tasksDate.filter(t => (t.year === year && t.month === month + 1) || t.repeat === "daily" || t.repeat === "monthly" || (t.month === month + 1 && t.repeat === "yearly"));
    
    const monthDiv = document.createElement("div");
    monthDiv.className = "month";

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
        const filterDay = filterYrMnth.filter(t => (t.day === day) || t.repeat === "daily");

        const container = document.createElement("div");
        container.className = "dayContainer";
        const dayDiv = document.createElement("div");
        dayDiv.className = "day";
        dayDiv.textContent = day;
        const tasksAmountDiv = document.createElement("div");
        tasksAmountDiv.className = "tasksAmount";
        tasksAmountDiv.textContent = `${filterDay.length} tasks`;

        container.appendChild(dayDiv);
        container.appendChild(tasksAmountDiv);
        daysDiv.appendChild(container);
    }

    monthDiv.appendChild(daysDiv);
    return monthDiv;
}

function generateMonthCalendar(year, month) {
    monthlyCalendarContainer.innerHTML = "";
    const monthCalendar = generateMonth(year, month);
    monthlyCalendarContainer.appendChild(monthCalendar);
    monthDisplay.textContent = `${monthNames[month]}, ${year}`;
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
}

// Initialize the calendar
initTasksDate().then(() => {
    generateMonthCalendar(currentYear, currentMonth);
});

document.getElementById("prevMonth").addEventListener("click", () => {
    changeMonth(-1);
});

document.getElementById("nextMonth").addEventListener("click", () => {
    changeMonth(1);
});