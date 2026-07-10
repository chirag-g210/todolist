let selectedTask = -1;

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
function deleteTask(button){

    let tasks = document.querySelectorAll("#taskList li");
    let index = [...tasks].indexOf(button.parentElement);

    button.parentElement.remove();

    tasks = document.querySelectorAll("#taskList li");

    if(tasks.length === 0){
        selectedTask = -1;
    }
    else if(index <= selectedTask){
        selectedTask = Math.max(0, selectedTask - 1);
    }

    updateSelection();
}


// Checkbox Toggle
function toggleTask(checkbox){

    let text = checkbox.nextElementSibling;

    text.classList.toggle("completed", checkbox.checked);

}


// Highlight Selected Task
function updateSelection(){

    let tasks = document.querySelectorAll("#taskList li");

    tasks.forEach(task => task.classList.remove("selected"));

    if(selectedTask >= 0 && selectedTask < tasks.length){

        tasks[selectedTask].classList.add("selected");

    }

}


// Keyboard Controls
document.addEventListener("keydown", function(event){

    let input = document.getElementById("taskInput");
    let tasks = document.querySelectorAll("#taskList li");


    // ENTER -> Add Task
    if(document.activeElement === input && event.key === "Enter"){

        addTask();
        return;

    }


    // DOWN -> First Task Select
    if(document.activeElement === input &&
       event.key === "ArrowDown" &&
       input.value.trim() === ""){

        if(tasks.length){

            selectedTask = 0;

            updateSelection();

            input.blur();

        }

        event.preventDefault();

        return;

    }


    // DOWN
    if(event.key === "ArrowDown"){

        if(selectedTask < tasks.length-1){

            selectedTask++;

            updateSelection();

        }

        event.preventDefault();

    }


    // UP
    if(event.key === "ArrowUp"){

        if(selectedTask > 0){

            selectedTask--;

            updateSelection();

        }

        event.preventDefault();

    }


    // ENTER -> Tick Untick
    if(event.key === "Enter" && selectedTask >= 0){

        let checkbox = tasks[selectedTask].querySelector("input");

        checkbox.checked = !checkbox.checked;

        toggleTask(checkbox);

    }


    // DELETE
    if(event.key === "Delete" && selectedTask >= 0){

        tasks[selectedTask].remove();

        tasks = document.querySelectorAll("#taskList li");

        if(tasks.length === 0){

            selectedTask = -1;

        }
        else if(selectedTask >= tasks.length){

            selectedTask = tasks.length-1;

        }

        updateSelection();

    }


    // ESC -> Back to Input
    if(event.key === "Escape"){

        selectedTask = -1;

        updateSelection();

        input.focus();

    }

});