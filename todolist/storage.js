
// STORAGE FUNCTIONS (LocalStorage Logic)


// Load tasks from LocalStorage
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
}

// Save tasks to LocalStorage
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render all tasks to the UI
function renderTasks() {
    const tasks = loadTasks();
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    tasks.forEach(task => {
        const li = createTaskElement(task);
        taskList.appendChild(li);
    });
    
    // Call updateSelection from script.js
    if (typeof updateSelection === 'function') {
        updateSelection();
    }
}

// Create a task element from task object
function createTaskElement(task) {
    const li = document.createElement('li');
    li.dataset.id = task.id;
    
    li.innerHTML = `
        <div class="task-content">
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleComplete(${task.id})">
            <span class="${task.completed ? 'completed' : ''}">${escapeHTML(task.title)}</span>
        </div>
        <button class="delete-btn" onclick="deleteTask(${task.id})">✖</button>
    `;
    
    return li;
}

// Escape HTML to prevent XSS
function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}


// CRUD OPERATIONS


// Add a new task
function addTask() {
    const input = document.getElementById('taskInput');
    const taskTitle = input.value.trim();
    
    if (taskTitle === '') {
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 350);
        return;
    }
    
    const tasks = loadTasks();
    const newTask = {
        id: Date.now(), // Unique ID based on timestamp
        title: taskTitle,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    saveTasks(tasks);
    renderTasks();
    
    input.value = '';
    input.focus();
}

// Delete a task by ID
function deleteTask(taskId) {
    let tasks = loadTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) return;
    
    tasks.splice(taskIndex, 1);
    saveTasks(tasks);
    renderTasks();
    
    // Reset selected task if no tasks left
    const remainingTasks = document.querySelectorAll('#taskList li');
    if (remainingTasks.length === 0) {
        if (typeof selectedTask !== 'undefined') {
            selectedTask = -1;
        }
    } else if (taskIndex <= selectedTask) {
        if (typeof selectedTask !== 'undefined') {
            selectedTask = Math.max(0, selectedTask - 1);
        }
    }
    
    if (typeof updateSelection === 'function') {
        updateSelection();
    }
}

// Toggle task completion status
function toggleComplete(taskId) {
    const tasks = loadTasks();
    const task = tasks.find(t => t.id === taskId);
    
    if (task) {
        task.completed = !task.completed;
        saveTasks(tasks);
        renderTasks();
        if (typeof updateSelection === 'function') {
            updateSelection();
        }
    }
}

// Edit a task (rename)
function editTask(taskId, newTitle) {
    const tasks = loadTasks();
    const task = tasks.find(t => t.id === taskId);
    
    if (task && newTitle.trim() !== '') {
        task.title = newTitle.trim();
        saveTasks(tasks);
        renderTasks();
        if (typeof updateSelection === 'function') {
            updateSelection();
        }
    }
}

// Clear all tasks (for testing)
function clearAllTasks() {
    if (confirm('Are you sure you want to delete all tasks?')) {
        saveTasks([]);
        renderTasks();
        if (typeof selectedTask !== 'undefined') {
            selectedTask = -1;
        }
        if (typeof updateSelection === 'function') {
            updateSelection();
        }
    }
}

// Get task statistics
function getTaskStats() {
    const tasks = loadTasks();
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    
    return { total, completed, pending };
}