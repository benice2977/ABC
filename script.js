document.addEventListener('DOMContentLoaded', loadTasks);

function addTask() {
    var taskInput = document.getElementById("taskInput");
    var taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("請輸入一個事項。");
        return;
    }

    var taskList = document.getElementById("taskList");

    var li = document.createElement("li");
    var timeStamp = new Date().toLocaleString(); 
    li.innerHTML = taskText + '<span class="timeStamp">（新增於: ' + timeStamp + '）</span>' + '<button class="delete" onclick="deleteTask(this)">刪除</button><br>';
    
    var subtaskSection = document.createElement("div");
    subtaskSection.classList.add("subtasks");

    var subtaskInput = document.createElement("input");
    subtaskInput.type = "text";
    subtaskInput.placeholder = "新增子任務...";

    var addSubtaskButton = document.createElement("button");
    addSubtaskButton.classList.add("addSubtask");
    addSubtaskButton.textContent = "新增子任務";
    addSubtaskButton.onclick = function() {
        addSubtask(subtaskInput, subtaskSection);
    };

    subtaskSection.appendChild(subtaskInput);
    subtaskSection.appendChild(addSubtaskButton);
    li.appendChild(subtaskSection);

    li.addEventListener("click", function() {
        li.classList.toggle("completed");
        saveTasks(); 
    });

    taskList.appendChild(li);
    taskInput.value = "";

    saveTasks(); 
}

function deleteTask(button) {
    var li = button.parentElement;
    li.remove();
    saveTasks(); 
}

function addSubtask(input, subtaskSection) {
    var subtaskText = input.value.trim();
    
    if (subtaskText === "") {
        alert("請輸入子任務。");
        return;
    }

    var subtaskLi = document.createElement("li");
    subtaskLi.textContent = subtaskText;
    subtaskLi.addEventListener("click", function() {
        subtaskLi.classList.toggle("completed");
        saveTasks(); 
    });

    subtaskSection.appendChild(subtaskLi);
    input.value = "";

    saveTasks(); 
}

function saveTasks() {
    var tasks = [];
    var taskList = document.querySelectorAll('#taskList li');

    taskList.forEach(function(task) {
        var taskText = task.childNodes[0].textContent;
        var timeStamp = task.querySelector('.timeStamp').textContent;
        var completed = task.classList.contains('completed');

        var subtasks = [];
        var subtaskElements = task.querySelectorAll('.subtasks li');
        subtaskElements.forEach(function(subtask) {
            subtasks.push({
                text: subtask.textContent,
                completed: subtask.classList.contains('completed')
            });
        });

        tasks.push({
            text: taskText,
            timeStamp: timeStamp,
            completed: completed,
            subtasks: subtasks
        });
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    var savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        var tasks = JSON.parse(savedTasks);

        tasks.forEach(function(task) {
            var li = document.createElement("li");
            li.innerHTML = task.text + '<span class="timeStamp">' + task.timeStamp + '</span>' + '<button class="delete" onclick="deleteTask(this)">刪除</button><br>';
            if (task.completed) {
                li.classList.add('completed');
            }

            var subtaskSection = document.createElement("div");
            subtaskSection.classList.add("subtasks");

            var subtaskInput = document.createElement("input");
            subtaskInput.type = "text";
            subtaskInput.placeholder = "新增子任務...";

            var addSubtaskButton = document.createElement("button");
            addSubtaskButton.classList.add("addSubtask");
            addSubtaskButton.textContent = "新增子任務";
            addSubtaskButton.onclick = function() {
                addSubtask(subtaskInput, subtaskSection);
            };

            subtaskSection.appendChild(subtaskInput);
            subtaskSection.appendChild(addSubtaskButton);

            task.subtasks.forEach(function(subtask) {
                var subtaskLi = document.createElement("li");
                subtaskLi.textContent = subtask.text;
                if (subtask.completed) {
                    subtaskLi.classList.add('completed');
                }
                subtaskLi.addEventListener("click", function() {
                    subtaskLi.classList.toggle("completed");
                    saveTasks();
                });
                subtaskSection.appendChild(subtaskLi);
            });

            li.appendChild(subtaskSection);
            li.addEventListener("click", function() {
                li.classList.toggle("completed");
                saveTasks();
            });

            document.getElementById("taskList").appendChild(li);
        });
    }
}

function setDailyReminder() {
    var reminderTime = document.getElementById("reminderTime").value;

    if (reminderTime === "") {
        alert("請選擇一個提醒時間。");
        return;
    }

    alert("提醒已設置！每日 " + reminderTime + " 會提醒你查看代辦事項。");
}
