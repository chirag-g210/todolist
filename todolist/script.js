// Add new task
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
}


// Delete task
function deleteTask(button) {
    button.parentElement.remove();
}


// Complete / Incomplete task
function toggleTask(checkbox) {
    let text = checkbox.nextElementSibling;
    text.classList.toggle("completed");
}

document.getElementById("taskInput").addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        addTask();
    }

});