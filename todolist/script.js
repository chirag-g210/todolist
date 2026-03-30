function addTask() {
  let input = document.getElementById("taskInput");
  let task = input.value;

  if (task === "") return;

  let li = document.createElement("li");
  li.innerHTML = `
    <span onclick="toggleTask(this)">${task}</span>
    <button onclick="deleteTask(this)">❌</button>
  `;

  document.getElementById("taskList").appendChild(li);
  input.value = "";
}

function deleteTask(button) {
  button.parentElement.remove();
}

function toggleTask(task) {
  task.parentElement.classList.toggle("completed");
}