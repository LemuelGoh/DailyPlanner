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
    // 将 dayDisplay 字符串解析为日期对象
    const date = new Date(dayDisplay);
    
    // 提取年、月、日
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始，所以加 1
    const day = String(date.getDate()).padStart(2, '0'); // 确保日是两位数
    
    // 返回格式化后的字符串
    return `${year}-${month}-${day}`;
}

// 调用 fetchDayTasks 函数时传入特定日期
date = document.getElementById("dayDisplay").textContent; // 获取日期字符串
const selectedDate = formatDateToYYYYMMDD(date); // 转换为 YYYY-MM-DD 格式
console.log(selectedDate);

// FUNCTION TO FETCH DAILY TASKS
function fetchDayTasks(selectedDate) {
    const email = localStorage.getItem("loggedInUser");

    db.collection("tasks").doc(email).collection("tasks").get()
        .then((querySnapshot) => {
            const dayTasks = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const taskDate = new Date(data.date); // 假设 date 是一个有效的日期字符串或时间戳
                const dateString = taskDate.toISOString().split('T')[0];

                // 仅获取与 selectedDate 匹配的任务
                if (dateString === selectedDate) {
                    dayTasks.push({
                        uid: doc.id,
                        description: data.description,
                        time: data.time,
                        priority: data.priority,
                        completed: data.completed
                    });
                }
            });

            generateTimeline(dayTasks);
        })
        .catch((error) => {
            console.error("Error fetching tasks: ", error);
        });
}


function generateTimeline(dayTasks) {
    const timeline = document.getElementById("timeline");
    timeline.innerHTML = ""; // 清空现有内容

    // 预处理任务以提高性能
    const tasksByTime = {};
    dayTasks.forEach(task => {
        const time = task.time; // 假设任务对象中有 time 属性
        if (!tasksByTime[time]) {
            tasksByTime[time] = [];
        }
        tasksByTime[time].push(task);
    });

    for (let hour = 0; hour < 24; hour++) {
        const formattedHour = `${hour.toString().padStart(2, "0")}:00`;
    
        // 创建时间槽
        const timeSlot = document.createElement("div");
        timeSlot.className = "time-slot";
    
        const hourLabel = document.createElement("span");
        hourLabel.className = "hour";
        hourLabel.textContent = formattedHour;
        timeSlot.appendChild(hourLabel);
    
        let hasTasks = false; // 用于检查是否有任务

        for (let minute = 0; minute < 60; minute += 1) { 
            const formattedTime = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
            const tasksForTime = tasksByTime[formattedTime] || []; // 获取该时间的任务
            
            if (tasksForTime.length > 0) {
                hasTasks = true; // 标记该时间段有任务
            }

            tasksForTime.forEach(task => {
                const taskDiv = document.createElement("div");
                taskDiv.className = "task";
                
                // 根据优先级设置任务描述颜色
                if (task.priority === "high") {
                    taskDiv.style.color = "#ff1e00";
                } else if (task.priority === "medium") {
                    taskDiv.style.color = "orange";
                } else if (task.priority === "low") {
                    taskDiv.style.color = "#5de651";
                }
                
                // 完成状态
                if (task.completed) {
                    taskDiv.style.textDecoration = "line-through";
                }
                
                taskDiv.textContent = task.description;
                taskDiv.setAttribute("data-uid", task.uid);
                timeSlot.appendChild(taskDiv);
            });
        }

        // 如果该时间段没有任务，显示提示
        if (!hasTasks) {
            const noTaskDiv = document.createElement("div");
            noTaskDiv.className = "no-task";
            noTaskDiv.textContent = "No tasks";
            timeSlot.appendChild(noTaskDiv);
        }

        timeline.appendChild(timeSlot);
    }
}

// 调用 fetchDayTasks 函数
fetchDayTasks(selectedDate);

//----------------------------
function changeDay(offset) {
    currentDate.setDate(currentDate.getDate() + offset);
    dayDisplay.textContent = currentDate.toLocaleDateString(undefined, options);
    date = document.getElementById("dayDisplay").textContent; // 获取日期字符串
    const selectedDate = formatDateToYYYYMMDD(date); // 转换为 YYYY-MM-DD 格式
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
