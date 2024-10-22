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
    var timeStamp = new Date().toLocaleString(); // 獲取當前日期和時間
    li.innerHTML = taskText + '<span class="timeStamp">（新增於: ' + timeStamp + '）</span>' + 
                   '<button class="completeTask" onclick="completeTask(this)">完成</button>' +
                   '<button class="delete" onclick="deleteTask(this)">刪除</button><br>';
    
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

    taskList.appendChild(li);
    taskInput.value = "";

    saveTasks(); 
}

function completeTask(button) {
    var task = button.parentElement;
    task.classList.toggle("completed");
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

    var subtaskLi = document.createElement("span");
    var timeStamp = new Date().toLocaleString(); // 記錄子任務的新增時間
    subtaskLi.innerHTML = subtaskText + '（新增於: ' + timeStamp + '）' + 
        '<button class="completeSubtask" onclick="completeSubtask(this)">完成</button>' +
        '<button class="deleteSubtask" onclick="deleteSubtask(this)">刪除</button> ------ ';

    subtaskLi.style.display = "inline-block"; // 子任務以橫向排列

    subtaskSection.appendChild(subtaskLi);
    input.value = "";

    saveTasks(); 
}

function completeSubtask(button) {
    var subtask = button.parentElement;
    subtask.classList.toggle("completed");
    saveTasks(); 
}

function deleteSubtask(button) {
    var subtask = button.parentElement;
    subtask.remove();
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
        var subtaskElements = task.querySelectorAll('.subtasks span');
        subtaskElements.forEach(function(subtask) {
            var subtaskText = subtask.childNodes[0].textContent;
            var subtaskTimeStamp = subtask.textContent.split('（新增於: ')[1].split('）')[0];
            var subtaskCompleted = subtask.classList.contains('completed');
            
            subtasks.push({
                text: subtaskText,
                timeStamp: subtaskTimeStamp,
                completed: subtaskCompleted
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
            li.innerHTML = task.text + '<span class="timeStamp">' + task.timeStamp + '</span>' + 
                           '<button class="completeTask" onclick="completeTask(this)">完成</button>' +
                           '<button class="delete" onclick="deleteTask(this)">刪除</button><br>';
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
                var subtaskLi = document.createElement("span");
                subtaskLi.innerHTML = subtask.text + '（新增於: ' + subtask.timeStamp + '）' + 
                    '<button class="completeSubtask" onclick="completeSubtask(this)">完成</button>' +
                    '<button class="deleteSubtask" onclick="deleteSubtask(this)">刪除</button> ------ ';
                subtaskLi.style.display = "inline-block";
                if (subtask.completed) {
                    subtaskLi.classList.add('completed');
                }
                subtaskSection.appendChild(subtaskLi);
            });

            li.appendChild(subtaskSection);
            document.getElementById("taskList").appendChild(li);
        });
    }
}
