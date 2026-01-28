let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let draggedTaskId = null;

//Save to localStorage
const saveTasks = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

//Render tasks
const renderTasks = () => {
  ["todo", "in-progress", "done"].forEach(id => {
    document.getElementById(id).innerHTML = "";
  });

  tasks.forEach(task => {
    const taskEl = document.createElement("div");
    taskEl.className = `task ${task.priority.toLowerCase()}`;
    taskEl.draggable = true;
    taskEl.dataset.id = task.id;

    taskEl.innerHTML = `
      <strong>${task.title}</strong>
      <p>${task.description}</p>
      <small>${task.priority}</small>
      <button class="delete-btn">Delete Task</button>
    `;

    document.getElementById(task.status).appendChild(taskEl);
  });

  saveTasks();
};

//Add task
const addTask = () => {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const priority = document.getElementById("priority").value;

  if (!title || !description) return alert("Fill all fields");

  tasks.push({
    id: Date.now(),
    title,
    description,
    priority,
    status: "todo"
  });

  document.getElementById("title").value = "";
  document.getElementById("description").value = "";

  renderTasks();
};

//Event Delegation
document.addEventListener("click", e => {
  if (e.target.classList.contains("add-task-btn")) {
    addTask();
  }
});

//Drag events
document.addEventListener("dragstart", e => {
  if (e.target.classList.contains("task")) {
    draggedTaskId = e.target.dataset.id;
  }
});

document.querySelectorAll(".task-list").forEach(column => {
  column.addEventListener("dragover", e => e.preventDefault());

  column.addEventListener("drop", e => {
    const task = tasks.find(t => t.id == draggedTaskId);
    task.status = column.id;
    renderTasks();
  });
});

//Search
document.getElementById("search").addEventListener("input", e => {
  const text = e.target.value.toLowerCase();
  document.querySelectorAll(".task").forEach(task => {
    task.style.display = task.innerText.toLowerCase().includes(text)
      ? "block"
      : "none";
  });
});
renderTasks();

document.addEventListener("click", (event) => {
    if(event.target.classList.contains("delete-btn")){
        const task = event.target.closest(".task");
        const taskId = task.dataset.id;

        //remove from DOM
        task.remove();

        //remove from localStorage
        removeTaskFromStorage(taskId);
    }
});

const removeTaskFromStorage = (id) => {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks = tasks.filter(task => task.id !== id);

    localStorage.setItem("tasks", JSON.stringify(tasks));
};
renderTasks();

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const taskId = e.target.closest(".task").dataset.id;

    // Remove from tasks array
    tasks = tasks.filter(task => task.id != taskId);

    // Save & re-render
    saveTasks();
    renderTasks();
  }
});