let selectedTask = -1;

window.onload = function () {
    let savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        document.getElementById("theme-btn").textContent = "☀️";
    }

    renderTasks();
};

function loadTasksFromStorage() {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
}

function saveTasksToStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    const tasks = loadTasksFromStorage();
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.dataset.id = task.id;
        
        li.innerHTML = `
            <div class="task-content">
                <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTaskFromStorage(this)">
                <span class="${task.completed ? 'completed' : ''}">${escapeHTML(task.title)}</span>
            </div>
            <button class="delete-btn" onclick="deleteTaskFromStorage(${task.id})">✖</button>
        `;
        
        taskList.appendChild(li);
    });
    
    updateSelection();
}

function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function addTask() {
    let input = document.getElementById("taskInput");
    let task = input.value.trim();

    if (task === "") {
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 350);
        return;
    }

    const tasks = loadTasksFromStorage();
    const newTask = {
        id: Date.now(),
        title: task,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    saveTasksToStorage(tasks);
    renderTasks();

    input.value = "";
    input.focus();
}

function deleteTaskFromStorage(taskId) {
    let tasks = loadTasksFromStorage();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) return;
    
    tasks.splice(taskIndex, 1);
    saveTasksToStorage(tasks);
    renderTasks();
    
    const remainingTasks = document.querySelectorAll('#taskList li');
    if (remainingTasks.length === 0) {
        selectedTask = -1;
    } else if (taskIndex <= selectedTask) {
        selectedTask = Math.max(0, selectedTask - 1);
    }
    updateSelection();
}

function toggleTaskFromStorage(checkbox) {
    const li = checkbox.closest('li');
    if (!li) return;
    
    const taskId = parseInt(li.dataset.id);
    const tasks = loadTasksFromStorage();
    const task = tasks.find(t => t.id === taskId);
    
    if (task) {
        task.completed = checkbox.checked;
        saveTasksToStorage(tasks);
        renderTasks();
        updateSelection();
    }
}

function deleteTask(button) {
    const li = button.parentElement;
    const taskId = parseInt(li.dataset.id);
    deleteTaskFromStorage(taskId);
}

function toggleTask(checkbox) {
    toggleTaskFromStorage(checkbox);
}

function updateSelection() {
    let tasks = document.querySelectorAll("#taskList li");
    
    tasks.forEach(task => task.classList.remove("selected"));
    
    if (selectedTask >= 0 && selectedTask < tasks.length) {
        tasks[selectedTask].classList.add("selected");
    }
}

function toggleTheme() {
    document.body.classList.toggle("dark");
    
    let themeBtn = document.getElementById("theme-btn");
    
    if (document.body.classList.contains("dark")) {
        themeBtn.textContent = "☀️";
        localStorage.setItem("theme", "dark");
    } else {
        themeBtn.textContent = "🌙";
        localStorage.setItem("theme", "light");
    }
}

document.addEventListener("keydown", function (event) {
    let input = document.getElementById("taskInput");
    let tasks = document.querySelectorAll("#taskList li");

    if (document.activeElement === input && event.key === "Enter") {
        addTask();
        return;
    }

    if (document.activeElement === input && event.key === "ArrowDown" && input.value.trim() === "") {
        if (tasks.length > 0) {
            selectedTask = 0;
            updateSelection();
            input.blur();
        }
        event.preventDefault();
        return;
    }

    if (event.key === "ArrowDown") {
        if (selectedTask < tasks.length - 1) {
            selectedTask++;
            updateSelection();
        }
        event.preventDefault();
    }

    if (event.key === "ArrowUp") {
        if (selectedTask > 0) {
            selectedTask--;
            updateSelection();
        }
        event.preventDefault();
    }

    if (event.key === "Enter" && selectedTask >= 0) {
        let checkbox = tasks[selectedTask].querySelector("input");
        if (checkbox) {
            checkbox.checked = !checkbox.checked;
            toggleTask(checkbox);
        }
    }

    if (event.key === "Delete" && selectedTask >= 0) {
        const selectedLi = tasks[selectedTask];
        const taskId = parseInt(selectedLi.dataset.id);
        deleteTaskFromStorage(taskId);
        
        tasks = document.querySelectorAll("#taskList li");
        if (tasks.length === 0) {
            selectedTask = -1;
        } else if (selectedTask >= tasks.length) {
            selectedTask = tasks.length - 1;
        }
        updateSelection();
    }

    if (event.key === "Escape") {
        selectedTask = -1;
        updateSelection();
        input.focus();
    }
});

function clearAllTasks() {
    if (confirm('Are you sure you want to delete all tasks?')) {
        saveTasksToStorage([]);
        renderTasks();
        selectedTask = -1;
        updateSelection();
    }
}