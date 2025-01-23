let currentDate = new Date();
const options = { timeZone: 'Asia/Kuala_Lumpur', year: "numeric", month: "long", day: "numeric" }; //display format
const weekDisplay = document.getElementById("weekDisplay");



const tasks = [
    { date: "-1", time: "-1", description: "-1", priority:"-1",completed:"-1",repeat:"-1", uid:"-1"},
];


// function formatDateToYYYYMMDD(startdate) {
//     let dateStrings = []; // Array to hold formatted dates
//     for (let i = 0; i < 7; i++) { // Corrected loop condition
//         const date = new Date(startdate);
//         date.setDate(date.getDate() + i); // Increment the date by i
        
//         const year = date.getFullYear();
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const day = String(date.getDate()).padStart(2, '0');
        
//         dateStrings.push(`${year}-${month}-${day}`); // Store the formatted date
//     }
//     console.log(dateStrings);
//     return dateStrings; // Return the array of formatted dates
// }

function formatDateToYYYYMMDD(dayDisplay) {
    const date = new Date(dayDisplay);
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

const weekTasks = [];

// Function to get the start and end dates of the current week
function getWeekRange(date) {
    const dayIndex = date.getDay();
    const startDate = new Date(date);
    startDate.setDate(date.getDate() - dayIndex);  // Start of the week (Sunday)
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);  // End of the week (Saturday)

    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedStartDate = startDate.toLocaleDateString('en-US', options);
    const formattedEndDate = endDate.toLocaleDateString('en-US', options);

    console.log(`Week Range: ${formattedStartDate} - ${formattedEndDate}`);

    // Collect tasks for the entire week
    for (let i = 0; i < 7; i++) {
        const day = new Date(startDate);
        day.setDate(startDate.getDate() + i);  // Get each day in the week
        const formattedDay = day.toLocaleDateString('en-US', options);
        const formattedDate = formatDateToYYYYMMDD(formattedDay);
        // Fetch tasks for the current day
        fetchDayTasks(formattedDate, i);
    }
    
    return `${formattedStartDate} - ${formattedEndDate}`;
}

// Function to fetch tasks for a specific day
function fetchDayTasks(selectedDate, index) {
    const email = localStorage.getItem("loggedInUser");

    db.collection("tasks").doc(email).collection("tasks").get()
        .then((querySnapshot) => {
            const dayTasks = []; // Temporary array to store tasks for the current day

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const taskDate = new Date(data.date);
                const dateString = taskDate.toISOString().split('T')[0];

                // Only fetch tasks matching the selectedDate
                if (dateString === selectedDate) {
                    dayTasks.push({
                        uid: doc.id,
                        date: data.date,
                        title: data.title,
                        time: data.time,
                        priority: data.priority,
                        completed: data.markAsDone
                    });
                }
            });

            // Push the tasks into the weekTasks array at the appropriate index


            console.log(`Tasks for ${selectedDate}:`, dayTasks);
        })
        .catch((error) => {
            console.error("Error fetching tasks: ", error);
        });
}


// Function to generate the timeline
function generateTimeline(dayTasks) {
    const timeline = document.getElementById("timeline");
    timeline.innerHTML = "";

    const tasksByTime = {};
    dayTasks.forEach(task => {
        const time = task.time;
        if (!tasksByTime[time]) {
            tasksByTime[time] = [];
        }
        tasksByTime[time].push(task);
    });

    for (let hour = 0; hour < 24; hour++) {
        const formattedHour = `${hour.toString().padStart(2, "0")}:00`;
    
        const timeSlot = document.createElement("div");
        timeSlot.className = "time-slot";
    
        const hourLabel = document.createElement("span");
        hourLabel.className = "hour";
        hourLabel.textContent = formattedHour;
        timeSlot.appendChild(hourLabel);
    
        let hasTasks = false;

        for (let minute = 0; minute < 60; minute += 1) { 
            const formattedTime = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
            const tasksForTime = tasksByTime[formattedTime] || [];
            
            if (tasksForTime.length > 0) {
                hasTasks = true;
            }

            tasksForTime.forEach(task => {
                const taskDiv = document.createElement("div");
                taskDiv.className = "task";
                
                // Create a button and add it to the taskDiv
                const taskButton = document.createElement("button");
                taskButton.textContent = task.title; // Set the button's text to the task title
                taskButton.className = "option-button"; // Add a class for styling the button
                taskButton.id = "edit-task-btn";
                
                if (task.completed) {
                    taskButton.style.setProperty("text-decoration", "line-through", "important");
                }
                
                // Set the button's text color based on task priority
                if (task.priority === "high") {
                    taskButton.style.color = "#ff1e00"; // High priority color
                } else if (task.priority === "medium") {
                    taskButton.style.color = "orange"; // Medium priority color
                } else if (task.priority === "low") {
                    taskButton.style.color = "#5de651"; // Low priority color
                }
                
                // Add an event listener for button clicks
                taskButton.addEventListener("click", (e) => {
                    e.stopPropagation(); // Prevent the click event from propagating to the taskDiv
                    const editTaskWidget = document.getElementById("edittask-widget");
                    // Toggle the visibility of the profile widget
                    editTaskWidget.classList.toggle("hide");
                    edittask(task.uid);
                });

                taskDiv.appendChild(taskButton);
                taskDiv.setAttribute("data-uid", task.uid);
                timeSlot.appendChild(taskDiv);
            });
        }



        timeline.appendChild(timeSlot);
    }
}


// EDIT TASKS BUTTON ----------------------------------------------------------------------------------------
function edittask(taskId) {
    const editTaskWidget = document.getElementById("edittask-widget");
    const email = localStorage.getItem("loggedInUser");

    db.collection("tasks")
    .doc(email)
    .collection("tasks")
    .doc(taskId)
    .get()
    .then((doc) => {
        if (doc.exists) {
            const taskData = doc.data();

            // Dynamically update the innerHTML with fetched task data
            editTaskWidget.innerHTML = `
            <div class="task-widget">
                <p>Edit Task:</p>
                <div class="addtask-container">
                    <div class="left-container" style="width: 60%; padding-right: 20px;">
                        <div class="setting-option4">
                            <label for="task-title">Title:</label>
                            <input type="text" id="task-title" class="task-input" value="${taskData.title || ''}" placeholder="Enter task title" />
                        </div>
                        <div class="setting-option4">
                            <label for="task-time">Time:</label>
                            <input type="time" id="task-time" class="task-input" value="${taskData.time || ''}" step="3600" />
                        </div>
                        <div class="setting-option4">
                            <label for="task-category">Category:</label>
                            <input type="text" id="task-category" class="task-input" value="${taskData.category || ''}" placeholder="Enter task category" />
                        </div>
                        <div class="setting-option4">
                            <label for="task-description">Description:</label>
                            <textarea id="task-description" class="task-input" placeholder="Enter task description">${taskData.description || ''}</textarea>
                        </div>
                        <div class="setting-option4">
                            <label for="task-date">Date:</label>
                            <input type="date" id="task-date" class="task-input" value="${taskData.date || ''}" />
                        </div>
                    </div>
                    <div class="right-container2" style="width: 40%;">
                        <div class="setting-option3">
                            <label for="task-reminder">Reminder:</label>
                            <select id="task-reminder" class="task-input">
                                <option value="0" ${taskData.reminder === '0' ? 'selected' : ''}>None</option>
                                <option value="15" ${taskData.reminder === '15' ? 'selected' : ''}>15 mins</option>
                                <option value="30" ${taskData.reminder === '30' ? 'selected' : ''}>30 mins</option>
                                <option value="45" ${taskData.reminder === '45' ? 'selected' : ''}>45 mins</option>
                                <option value="60" ${taskData.reminder === '60' ? 'selected' : ''}>60 mins</option>
                            </select>
                        </div>
                        <div class="setting-option3">
                            <label for="task-priority">Priority:</label>
                            <select id="task-priority" class="task-input">
                                <option value="low" ${taskData.priority === 'low' ? 'selected' : ''}>Low</option>
                                <option value="medium" ${taskData.priority === 'medium' ? 'selected' : ''}>Medium</option>
                                <option value="high" ${taskData.priority === 'high' ? 'selected' : ''}>High</option>
                            </select>
                        </div>
                        <div class="setting-option3">
                        <label for="task-recurring">Task Recurring:</label>
                            <select id="task-recurring" class="task-input" disabled>
                                <option value="0" ${taskData.recurring === '0' ? 'selected' : ''}>None</option>
                                <option value="1" ${taskData.recurring === '1' ? 'selected' : ''}>Day</option>
                                <option value="7" ${taskData.recurring === '7' ? 'selected' : ''}>Week</option>
                                <option value="30" ${taskData.recurring === '30' ? 'selected' : ''}>Month</option>
                            </select>
                        </div>
                        <div class="setting-option3">
                            <label for="task-date">End Date:</label>
                            <input type="date" id="end-reccuring-date" class="task-input" value="${taskData.enddate || ''}" />
                        </div>
                        <div class="setting-option3">
                            <label for="mark-as-done">Mark as Done:</label>
                            <input type="checkbox" id="mark-as-done" ${taskData.markAsDone ? 'checked' : ''} />
                        </div>
                        <div class="setting-option2">
                            <button id="close-edittask-widget" class="close-button">Cancel</button>
                            <button id="delete-task-button" class="close-button" style="background-color: red; color: white;">Delete</button>
                            <button id="save-button" class="close-button">Save</button>
                        </div>
                    </div>
                </div>
            </div>
            `;
            // Add Delete button event listener
            document.getElementById("delete-task-button").addEventListener("click", function () {
                // Confirm with the user before deleting the task
                const confirmDelete = confirm("Are you sure you want to delete this task?");
                if (confirmDelete) {
                    const email = localStorage.getItem("loggedInUser"); // Assuming logged-in user is stored in localStorage
            
                    // Delete the task from the database
                    db.collection("tasks")
                        .doc(email)
                        .collection("tasks")
                        .doc(taskId)
                        .delete()
                        .then(() => {
                            alert("Task deleted successfully.");
                            // Hide the edit task widget after deletion
                            document.getElementById("edittask-widget").classList.add("hide");
                            const selectedDate = formatDateToYYYYMMDD(date);
                            fetchDayTasks(selectedDate);
                        })
                        .catch((error) => {
                            console.error("Error deleting task: ", error);
                            alert("Failed to delete the task. Please try again.");
                        });
                }
            });

            // Add Cancel and Save button event listeners
            document.getElementById("close-edittask-widget").addEventListener("click", function () {
                editTaskWidget.classList.add("hide");
            });

            document.getElementById("save-button").addEventListener("click", function () {
                const updatedTaskData = {
                    title: document.getElementById("task-title").value,
                    time: document.getElementById("task-time").value,
                    category: document.getElementById("task-category").value,
                    description: document.getElementById("task-description").value,
                    date: document.getElementById("task-date").value,
                    reminder: document.getElementById("task-reminder").value,
                    priority: document.getElementById("task-priority").value,
                    recurring: document.getElementById("task-recurring").value,
                    enddate: document.getElementById("end-reccuring-date").value,
                    markAsDone: document.getElementById("mark-as-done").checked,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                };

                db.collection("tasks")
                    .doc(email)
                    .collection("tasks")
                    .doc(taskId)
                    .update(updatedTaskData)
                    .then(() => {
                        alert("Task updated successfully");
                        editTaskWidget.classList.add("hide");
                        date = document.getElementById("dayDisplay").textContent;
                        const selectedDate = formatDateToYYYYMMDD(date);
                        fetchDayTasks(selectedDate);
                    })
                    .catch((error) => {
                        console.error("Error updating task: ", error);
                        alert("Error updating task");
                    });
            });
        } else {
            console.error("Task not found!");
        }
    })
    .catch((error) => {
        console.error("Error fetching task: ", error);
    });
}
// EDIT TASKS BUTTON ----------------------------------------------------------------------------------------


//----------------------------
// Update changeDay to handle weeks
function changeWeek(offset) {
    currentDate.setDate(currentDate.getDate() + offset * 7);
    weekDisplay.textContent = getWeekRange(currentDate);

    // Clear and regenerate the timeline for the new week
    const formattedDate = currentDate.toISOString().split("T")[0];
    const dayTasks = tasks.filter(t => 
        (t.date === formattedDate) || 
        (t.date.substring(4) === formattedDate.substring(4) && t.repeat === "yearly") ||
        (t.date.substring(8) === formattedDate.substring(8) && t.repeat === "monthly") ||
        t.repeat === "daily"
    ); // Filter tasks by current date
    generateTimeline(dayTasks); // Pass filtered tasks to the timeline
}

// Update event listeners to change by weeks
document.getElementById("prevWeek").addEventListener("click", () => {
    changeWeek(-1);
});
document.getElementById("nextWeek").addEventListener("click", () => {
    changeWeek(1);
});




weekDisplay.textContent = getWeekRange(currentDate);

//--------------------
// Initialize the timeline for the current date
const formattedDate = currentDate.toISOString().split("T")[0];

// const dayTasks = tasks.filter(t => (t.date === formattedDate) || (t.date.substring(4) === formattedDate.substring(4) && t.repeat === "yearly") ||
// (t.date.substring(8) === formattedDate.substring(8) && t.repeat === "monthly") ||t.repeat === "daily"); //filter tasks to this day task only

generateTimeline(weekTasks);