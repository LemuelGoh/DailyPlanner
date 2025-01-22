//check if user logged in
if(!localStorage.getItem("loggedInUser")) {
    alert("Please Log In before using the calendar!");
    window.location.href = "login.html";
}
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

function fetchTasks() {
    const email = localStorage.getItem("loggedInUser");

    db.collection("tasks").doc(email).collection("tasks").get()
        .then((querySnapshot) => {
            const tasksCountByDate = {};
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const taskDate = data.date;
                const dateString = new Date(taskDate).toISOString().split('T')[0];
                
                if (!tasksCountByDate[dateString]) {
                    tasksCountByDate[dateString] = 0;
                }
                tasksCountByDate[dateString]++;
            });

            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth(); // 0-11
            generateMonthCalendar(currentYear, currentMonth, tasksCountByDate);
            addDaysEventListener();
        })
        .catch((error) => {
            console.error("Error fetching tasks: ", error);
        });
}

function generateMonth(year, month, tasksCountByDate) {
    // const tasksCountByDate = 1; // 用于存储每个日期的任务数量 
       
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

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

        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const taskCount = tasksCountByDate[dateString] || 0; // 获取该日期的任务数量，默认为 0

        const tasksAmountDiv = document.createElement("div");
        tasksAmountDiv.className = "tasksAmount";
        tasksAmountDiv.textContent = `${taskCount} TASKS`; // 显示任务数量

        container.appendChild(dayDiv);
        container.appendChild(tasksAmountDiv);
        daysDiv.appendChild(container);
    }

    monthDiv.appendChild(daysDiv);
    return monthDiv;
}

fetchTasks(); // 调用函数以获取任务并生成日历

function generateMonthCalendar(year, month, tasksCountByDate) {
    monthlyCalendarContainer.innerHTML = ""; // Clear old monthly calendar
    const monthCalendar = generateMonth(year, month, tasksCountByDate);
    monthlyCalendarContainer.appendChild(monthCalendar);
    monthDisplay.textContent = `${monthNames[month]}, ${year}`;
    addDaysEventListener();
}


// Change Month ----------------------------------------------------------------------------------
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
    generateMonthCalendar(currentYear, currentMonth, tasksCountByDate);
    addDaysEventListener();
}

document.getElementById("prevMonth").addEventListener("click", () => {
    changeMonth(-1);
});

document.getElementById("nextMonth").addEventListener("click", () => {
    changeMonth(1);
});
// Change Month ----------------------------------------------------------------------------------


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
