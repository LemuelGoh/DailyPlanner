let currentDate = new Date();
const options = { timeZone: 'Asia/Kuala_Lumpur', year: "numeric", month: "long", day: "numeric" }; //display format
const dayDisplay = document.getElementById("dayDisplay");

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

// Function to generate the timeline
function generateTimeline(dayTasks) {
    const timeline = document.getElementById("timeline");
    timeline.innerHTML = ""; // Clear any existing content

    for (let hour = 0; hour < 24; hour++) {
        const formattedHour = `${hour.toString().padStart(2, "0")}:00`;
    
        // Create time slot
        const timeSlot = document.createElement("div");
        timeSlot.className = "time-slot";
    
        const hourLabel = document.createElement("span");
        hourLabel.className = "hour";
        hourLabel.textContent = formattedHour;
        timeSlot.appendChild(hourLabel);
    
        for (let minute = 0; minute < 60; minute += 1) { 
            const formattedTime = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
            const tasksForTime = dayTasks.filter(t => t.time === formattedTime);
      
            tasksForTime.forEach(task => {
              const taskDiv = document.createElement("div");
              taskDiv.className = "task";
              if(task.priority == "high") { //change task description color according to priority
                taskDiv.style.color = "#ff1e00";
              } else if (task.priority == "medium") {
                taskDiv.style.color = "orange";
              } else if (task.priority == "low") {
                taskDiv.style.color = "#5de651";
              }
              if(task.completed) {
                taskDiv.style.textDecoration = "line-through";
              }
              taskDiv.textContent = task.description;
              taskDiv.setAttribute("data-uid",task.uid);
              timeSlot.appendChild(taskDiv);
            });
        }
    
        timeline.appendChild(timeSlot);
    }
}
//loader
// function hideLoader() {
//     const loader = document.querySelector(".loader");
//     loader.style.display = "none";
//     const loaderContainer = document.getElementById("loaderContainer");
//     loaderContainer.style.display = "none";
// }
// function showLoader() {
//     const loader = document.querySelector(".loader");
//     loader.style.display = "flex";
//     const loaderContainer = document.getElementById("loaderContainer");
//     loaderContainer.style.display = "flex";
// }
//-----------------------
//manage task
function taskAddEventListener() {
    const tasksDiv = document.getElementsByClassName("task");
    const mainContainer = document.getElementById("dailyCalendarContainer");
    const addTaskBtn = document.getElementById("addTaskButton");
    const updateTaskBtn = document.getElementById("updateTaskButton");
    const manageTaskContainer = document.getElementById("manageTaskContainer");
    for(let i = 0; i < tasksDiv.length; i++) { //loop thru every task in the day
        tasksDiv[i].addEventListener("click", ()=> { //add event listener for every task
            const task = tasks.find(event => tasksDiv[i].getAttribute("data-uid") === event.uid); //get task inside tasks array

            let descriptionDiv = document.getElementById("description");
            descriptionDiv.textContent = `Description: ${task.description}`;
            let startTimeDiv = document.getElementById("startTime");
            startTimeDiv.textContent = `Start Time: ${task.time}`;
            let dateDiv = document.getElementById("date");
            dateDiv.textContent = `Date: ${task.date}`;
            let priorityDiv = document.getElementById("priority");
            priorityDiv.textContent = `Priority: ${task.priority}`;
            const completeCheckbox = document.getElementById("checkbox");
            if(task.completed) completeCheckbox.checked = true;
            let repeatDiv = document.getElementById("repeat");
            repeatDiv.textContent = `Repeat: ${task.repeat}`;
            
            mainContainer.classList.add("hide") //hide mainContainer
            addTaskBtn.classList.add("hide") //hide add task button
            manageTaskContainer.classList.remove("hide");//show manage task container

            //addeventlistener to descriptionDiv, startTimeDiv, dateDiv, priorityDiv, repeatDiv
            descriptionDiv.addEventListener("click",()=>{
                const descriptionInput = prompt("Enter New Description");
                if(descriptionInput)
                descriptionDiv.textContent = `Description: ${descriptionInput}`;
            })
            startTimeDiv.addEventListener("click",()=>{
                const startTimeInput = prompt("Enter new task time (HH:MM, 24-hour format):");
                if(startTimeInput)
                startTimeDiv.textContent = `Start Time: ${startTimeInput}`;
            })
            dateDiv.addEventListener("click",()=>{
                const dateInput = prompt("Enter New Date (YYYY-MM-DD)");
                if(dateInput)
                dateDiv.textContent = `Date: ${dateInput}`;
            })
            priorityDiv.addEventListener("click",()=>{
                const priorityInput = prompt("Enter New Priority (high,medium,low)");
                if(priorityInput)
                priorityDiv.textContent = `Priority: ${priorityInput}`;
            })
            repeatDiv.addEventListener("click",()=>{
                const repeatInput = prompt("Enter New Repeat: (yearly,monthly,daily, none)");
                if(repeatInput)
                    repeatDiv.textContent = `Repeat: ${repeatInput}`;
            })
            //addeventlistener to remove
            document.getElementById("removeTaskButton").addEventListener("click",()=>{
                showLoader();
                const taskRef = doc(firestore,"users",localStorage.getItem("user"),"tasks",task.uid);
                deleteDoc(taskRef).then(()=>{hideLoader();alert("Task Deleted");window.location.href = "dailyCalendar.html";});
            })

            // addeventlistener to update
            updateTaskBtn.addEventListener("click",()=>{
                showLoader();
                const taskRef = doc(firestore,"users",localStorage.getItem("user"),"tasks",task.uid);
                if(completeCheckbox.checked){
                    updateDoc(taskRef,{
                        Description: descriptionDiv.textContent.substring(13),
                        StartTime: startTimeDiv.textContent.substring(12),
                        date:  dateDiv.textContent.substring(6),
                        priority: priorityDiv.textContent.substring(10),
                        completed:true,
                        repeat: repeatDiv.textContent.substring(8),
                    }).then(()=>{
                        hideLoader();
                        alert("Update Successfully!");
                        window.location.href = "dailyCalendar.html";
                    })
                } else {
                    updateDoc(taskRef,{
                        Description: descriptionDiv.textContent.substring(13),
                        StartTime: startTimeDiv.textContent.substring(12),
                        date:  dateDiv.textContent.substring(6),
                        priority: priorityDiv.textContent.substring(10),
                        repeat: repeatDiv.textContent.substring(8),
                        completed:false,
                    }).then(()=>{
                        hideLoader();
                        alert("Update Successfully!");
                        window.location.href = "dailyCalendar.html";
                    })
                }
            })

        })
    }
}
// document.getElementById("close").addEventListener("click",()=> {
//     const mainContainer = document.getElementById("dailyCalendarContainer");
//     const manageTaskContainer = document.getElementById("manageTaskContainer");
//     const addTaskBtn = document.getElementById("addTaskButton");
//     mainContainer.classList.remove("hide"); //show mainContainer
//     addTaskBtn.classList.remove("hide"); //show add task button
//     manageTaskContainer.classList.add("hide"); //hide manageTaskContainer
// })
//----------------------------
function changeDay(offset) {
    currentDate.setDate(currentDate.getDate() + offset);
    dayDisplay.textContent = currentDate.toLocaleDateString(undefined, options);

    // Clear and regenerate the timeline for the new date
    const formattedDate = currentDate.toISOString().split("T")[0];
    const dayTasks = tasks.filter(t => (t.date === formattedDate) || (t.date.substring(4) === formattedDate.substring(4) && t.repeat === "yearly") ||
    (t.date.substring(8) === formattedDate.substring(8) && t.repeat === "monthly") || t.repeat === "daily"); // Filter tasks by current date
    generateTimeline(dayTasks); // Pass filtered tasks to the timeline
    taskAddEventListener();
}//2025-01-24
//add eventlistener for left and right arrow change day
document.getElementById("prevDay").addEventListener("click",()=>{
    changeDay(-1);
})
document.getElementById("nextDay").addEventListener("click",()=>{
    changeDay(1);
})





//--------------------
// Initialize the timeline for the current date
const formattedDate = currentDate.toISOString().split("T")[0];
const dayTasks = tasks.filter(t => (t.date === formattedDate) || (t.date.substring(4) === formattedDate.substring(4) && t.repeat === "yearly") ||
(t.date.substring(8) === formattedDate.substring(8) && t.repeat === "monthly") ||t.repeat === "daily"); //filter tasks to this day task only

generateTimeline(dayTasks);
taskAddEventListener();
// hideLoader();