let currentDate = new Date();
const options = { timeZone: 'Asia/Kuala_Lumpur', year: "numeric", month: "long", day: "numeric" }; //display format
const dayDisplay = document.getElementById("dayDisplay");
console.log(dayDisplay);


//sync with tdy or redirect date from month/year
if(sessionStorage.getItem("storageRedirectDate")==currentDate.toLocaleDateString('en-US', options)) { //if redirect date is tdy
    dayDisplay.textContent = currentDate.toLocaleDateString('en-US', options);
    sessionStorage.removeItem("storageRedirectDate");
}
else if(sessionStorage.getItem("storageRedirectDate")) {
    currentDate = new Date(`${sessionStorage.getItem("storageRedirectDate")} 16:00:00`);
    dayDisplay.textContent = sessionStorage.getItem("storageRedirectDate");
    sessionStorage.removeItem("storageRedirectDate");
} else {
    //convert utc to malaysia time
    dayDisplay.textContent = currentDate.toLocaleDateString('en-US', options);
}

const tasks = [
    { date: "-1", time: "-1", description: "-1", priority:"-1",completed:"-1",repeat:"-1", uid:"-1"},
];

function formatDateToYYYYMMDD(dayDisplay) {
    const date = new Date(dayDisplay);
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}



date = document.getElementById("dayDisplay").textContent;
const selectedDate = formatDateToYYYYMMDD(date);
console.log(selectedDate);

function fetchDayTasks(selectedDate) {
    const email = localStorage.getItem("loggedInUser");

    db.collection("tasks").doc(email).collection("tasks").get()
        .then((querySnapshot) => {
            const dayTasks = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const taskDate = new Date(data.date);
                const dateString = taskDate.toISOString().split('T')[0];

                // 仅获取与 selectedDate 匹配的任务
                if (dateString === selectedDate) {
                    dayTasks.push({
                        uid: doc.id,
                        title: data.title,
                        time: data.time,
                        priority: data.priority,
                        completed: data.markAsDone
                    });
                }
                console.log(dayTasks);
            });
            generateTimeline(dayTasks);
        })
        .catch((error) => {
            console.error("Error fetching tasks: ", error);
        });
}

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

        if (!hasTasks) {
            const noTaskDiv = document.createElement("div");
            noTaskDiv.className = "no-task";
            noTaskDiv.textContent = "No tasks";
            timeSlot.appendChild(noTaskDiv);
        }

        timeline.appendChild(timeSlot);
    }
}
document.getElementById("add-tasks-btn").addEventListener("click", function() {
    const addtaskWidget = document.getElementById("addtask-widget");
    // Toggle the visibility of the profile widget
    addtaskWidget.classList.toggle("hide");
    addtask();
});


// ADD TASK BUTTON ----------------------------------------------------------------------------------------
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
                    <label for="task-date">End Date:</label>
                    <input type="date" id="end-reccuring-date" class="task-input" />
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
                fetchDayTasks(selectedDate);
            }, 1500);
        } else {
            // If no recurring interval is set, add the task once
            const taskWithDate = { ...taskData, date: date };
            db.collection("tasks").doc(email).collection("tasks").add(taskWithDate)
                .then(() => alert("Task added successfully!"))
                .catch((error) => console.error("Error adding task: ", error));
            setTimeout(() => {
                fetchDayTasks(selectedDate);
            }, 1500);
        }

        // Hide the add task widget after saving
        addtaskWidget.classList.add("hide");

    });
}
// ADD TASK BUTTON ----------------------------------------------------------------------------------------


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
function changeDay(offset) {
    currentDate.setDate(currentDate.getDate() + offset);
    dayDisplay.textContent = currentDate.toLocaleDateString(undefined, options);
    date = document.getElementById("dayDisplay").textContent;
    const selectedDate = formatDateToYYYYMMDD(date);
    console.log(selectedDate);
    fetchDayTasks(selectedDate);
}

//add eventlistener for left and right arrow change day
document.getElementById("prevDay").addEventListener("click",()=>{
    changeDay(-1);
})
document.getElementById("nextDay").addEventListener("click",()=>{
    changeDay(1);
})

fetchDayTasks(selectedDate);