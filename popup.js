const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const filterBtns = document.querySelectorAll(".filters button");

let tasks = [];
let currentFilter = "all";

// Load tasks
chrome.storage.sync.get(["tasks"], (result) => {
  tasks = result.tasks || [];
  renderTasks();
});

// Add task
addTaskBtn.onclick = () => {
  if (!taskInput.value.trim()) return;

  tasks.push({
    title: taskInput.value,
    status: "pending"
  });

  taskInput.value = "";
  saveAndRender();
};

// Render
function renderTasks() {
  taskList.innerHTML = "";

  tasks
    .filter(task => {
      if (currentFilter === "pending") return task.status === "pending";
      if (currentFilter === "completed") return task.status === "completed";
      return true;
    })
    .forEach((task, index) => {
      const card = document.createElement("div");
      card.className = "task-card";

      const status = document.createElement("div");
      status.className = `status ${task.status}`;
      status.textContent = `Status: ${task.status}`;

      const title = document.createElement("div");
      title.className = "task-title";
      title.textContent = task.title;

      const actions = document.createElement("div");
      actions.className = "actions";

      if (task.status === "pending") {
        const completeBtn = document.createElement("button");
        completeBtn.className = "complete-btn";
        completeBtn.textContent = "Mark Completed";
        completeBtn.onclick = () => {
          task.status = "completed";
          saveAndRender();
        };
        actions.appendChild(completeBtn);
      }

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "Delete";
      deleteBtn.onclick = () => {
        tasks.splice(index, 1);
        saveAndRender();
      };

      actions.appendChild(deleteBtn);

      card.appendChild(status);
      card.appendChild(title);
      card.appendChild(actions);
      taskList.appendChild(card);
    });
}

// Filters
filterBtns.forEach(btn => {
  btn.onclick = () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  };
});

function saveAndRender() {
  chrome.storage.sync.set({ tasks });
  renderTasks();
}
