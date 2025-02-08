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

fetchTasks();

function generateMonthCalendar(year, month, tasksCountByDate) {
    monthlyCalendarContainer.innerHTML = ""; // Clear old monthly calendar
    const monthCalendar = generateMonth(year, month, tasksCountByDate);
    monthlyCalendarContainer.appendChild(monthCalendar);
    monthDisplay.textContent = `${monthNames[month]}, ${year}`;
    addDaysEventListener();
}

function fetchTasksForMonth(year, month) {
    const email = localStorage.getItem("loggedInUser");

    db.collection("tasks").doc(email).collection("tasks").get()
        .then((querySnapshot) => {
            const tasksCountByDate = {};
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const taskDate = new Date(data.date);
                if (taskDate.getFullYear() === year && taskDate.getMonth() === month) {
                    const dateString = taskDate.toISOString().split("T")[0];
                    if (!tasksCountByDate[dateString]) {
                        tasksCountByDate[dateString] = 0;
                    }
                    tasksCountByDate[dateString]++;
                }
            });

            generateMonthCalendar(year, month, tasksCountByDate);
        })
        .catch((error) => {
            console.error("Error fetching tasks for the month: ", error);
        });
}
// ADD TASKS BUTTON ----------------------------------------------------------------------------------------
document.getElementById("add-tasks-btn").addEventListener("click", function() {
    const addtaskWidget = document.getElementById("addtask-widget");
    // Toggle the visibility of the profile widget
    addtaskWidget.classList.toggle("hide");
    addtask();
});

async function addtask() {
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
                    <select id="task-reminder" class="task-input premium-feature">
                        <option value="0">None</option>
                        <option value="15">15 mins</option>
                        <option value="30">30 mins</option>
                        <option value="45">45 mins</option>
                        <option value="60">60 mins</option>
                    </select>
                </div>
                <div class="setting-option3">
                    <label for="task-priority">Priority:</label>
                    <select id="task-priority" class="task-input premium-feature">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <div class="setting-option3">
                    <label for="task-recurring">Task Recurring:</label>
                    <select id="task-recurring" class="task-input premium-feature">
                        <option value="0">None</option>
                        <option value="1">Day</option>
                        <option value="7">Week</option>
                        <option value="30">Month</option>
                    </select>
                </div>
                <div class="setting-option3">
                    <label for="task-date">End Date:</label>
                    <input type="date" id="end-reccuring-date" class="task-input premium-feature" />
                </div>
                <div class="setting-option3">
                    <label for="mark-as-done">Mark as Done:</label>
                    <input type="checkbox" id="mark-as-done" />
                </div>
                <div class="setting-option2">
                    <button id="close-addtask-widget" class="close-button">Cancel</button>
                    <button id="save-button" class="close-button">Save</button>
                </div>
            </div>
        </div>
    </div>
    `;

    var email = localStorage.getItem("loggedInUser");

    if (email) {
        try {
            // Retrieve user details (MUST use await)
            const userSnapshot = await db.collection("users").where("email", "==", email).get();
            
            if (!userSnapshot.empty) {
                const userData = userSnapshot.docs[0].data();
                const isPremium = userData.isPremium || false;
                console.log("User is premium: ", isPremium);
    
                // Disable premium features if user is not premium
                if (!isPremium) {
                    document.querySelectorAll(".premium-feature").forEach((element) => {
                        element.disabled = true;
                        element.title = "Upgrade to premium to use this feature!";
                    });
                }
            } else {
                console.error("User not found in Firestore.");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    } else {
        console.error("No logged-in user found.");
    }
    

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
        const enddate = getElementVal('end-reccuring-date');
        const markAsDone = document.getElementById('mark-as-done').checked;
        
        if (!email || !title || !date) {
            alert("Please fill in all required fields!");
            return;
        }

        const taskData = {
            title: title,
            time: time,
            category: category,
            description: description,
            date: date,
            reminder: reminder,
            priority: priority,
            recurring: recurring,
            enddate: enddate,
            markAsDone: markAsDone,
            createdAt: firebase.firestore.FieldValue.serverTimestamp() 
        };
    

        if (recurring > 0 && date && enddate) {
            let currentDate = new Date(date); // Start date
            const endRecurringDate = new Date(enddate); // End date
        
            // Loop to add recurring tasks until the currentDate exceeds the end date
            while (currentDate <= endRecurringDate) {
                // Create a task with the updated date
                const taskWithDate = {
                    ...taskData,
                    date: currentDate.toISOString().split("T")[0], // Format date as YYYY-MM-DD
                };
        
                // Add the task to the database
                db.collection("tasks").doc(email).collection("tasks").add(taskWithDate)
                    .catch((error) => console.error("Error adding recurring task: ", error));
        
                // Increment the date safely
                currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + parseInt(recurring));
            }
        
            alert("Recurring tasks added successfully!");
            setTimeout(() => {
                fetchTasksForMonth(currentYear, currentMonth); // Call the function after 1 second
            }, 1500); // 1000ms = 1 second // Fetch tasks for the new month
        } else {
            // If no recurring interval is set, add the task once
            const taskWithDate = { ...taskData, date: date };
            db.collection("tasks").doc(email).collection("tasks").add(taskWithDate)
                .then(() => alert("Task added successfully!"))
                .catch((error) => console.error("Error adding task: ", error));
            setTimeout(() => {
                fetchTasksForMonth(currentYear, currentMonth); // Call the function after 1 second
            }, 1500); // 1000ms = 1 second // Fetch tasks for the new month
            
        }

        // Hide the add task widget after saving
        addtaskWidget.classList.add("hide");

    });
}
// ADD TASKS BUTTON ----------------------------------------------------------------------------------------

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

    fetchTasksForMonth(currentYear, currentMonth); // Fetch tasks for the new month
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
