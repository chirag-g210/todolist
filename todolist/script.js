// Selected Task Index

let selectedTask = -1;

// Load Saved Theme

window.onload = function () {
    let savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        document.getElementById("theme-btn").textContent = "☀️";
    }
};

// Add Task

function addTask() {

    let input = document.getElementById("taskInput");
    let task = input.value.trim();

    if (task === "") return;

    let li = document.createElement("li");

    li.innerHTML = `
        <div class="task-content">
            <input type="checkbox" onchange="toggleTask(this)">
            <span>${task}</span>
        </div>

        <button class="delete-btn" onclick="deleteTask(this)">✖</button>
    `;

    document.getElementById("taskList").appendChild(li);

    input.value = "";
    input.focus();

    updateSelection();
}

// Delete Task

function deleteTask(button) {

    let tasks = document.querySelectorAll("#taskList li");
    let index = [...tasks].indexOf(button.parentElement);

    button.parentElement.remove();

    tasks = document.querySelectorAll("#taskList li");

    if (tasks.length === 0) {
        selectedTask = -1;
    } else if (index <= selectedTask) {
        selectedTask = Math.max(0, selectedTask - 1);
    }

    updateSelection();
}

// Toggle Checkbox

function toggleTask(checkbox) {

    let text = checkbox.nextElementSibling;

    text.classList.toggle("completed", checkbox.checked);

}

// Highlight Selected Task

function updateSelection() {

    let tasks = document.querySelectorAll("#taskList li");

    tasks.forEach(task => task.classList.remove("selected"));

    if (selectedTask >= 0 && selectedTask < tasks.length) {
        tasks[selectedTask].classList.add("selected");
    }

}

// Theme Toggle

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

// Keyboard Controls

document.addEventListener("keydown", function (event) {

    let input = document.getElementById("taskInput");
    let tasks = document.querySelectorAll("#taskList li");

    // Enter -> Add Task
    if (document.activeElement === input && event.key === "Enter") {
        addTask();
        return;
    }

    // Down Arrow -> Select First Task
    if (
        document.activeElement === input &&
        event.key === "ArrowDown" &&
        input.value.trim() === ""
    ) {

        if (tasks.length > 0) {

            selectedTask = 0;
            updateSelection();
            input.blur();

        }

        event.preventDefault();
        return;
    }

    // Down Arrow
    if (event.key === "ArrowDown") {

        if (selectedTask < tasks.length - 1) {

            selectedTask++;
            updateSelection();

        }

        event.preventDefault();
    }

    // Up Arrow
    if (event.key === "ArrowUp") {

        if (selectedTask > 0) {

            selectedTask--;
            updateSelection();

        }

        event.preventDefault();
    }

    // Enter -> Tick / Untick
    if (event.key === "Enter" && selectedTask >= 0) {

        let checkbox = tasks[selectedTask].querySelector("input");

        checkbox.checked = !checkbox.checked;

        toggleTask(checkbox);

    }

    // Delete -> Delete Selected Task
    if (event.key === "Delete" && selectedTask >= 0) {

        tasks[selectedTask].remove();

        tasks = document.querySelectorAll("#taskList li");

        if (tasks.length === 0) {

            selectedTask = -1;

        } else if (selectedTask >= tasks.length) {

            selectedTask = tasks.length - 1;

        }

        updateSelection();

    }

    // Escape -> Back to Input
    if (event.key === "Escape") {

        selectedTask = -1;
        updateSelection();
        input.focus();

    }

});
