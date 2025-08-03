import { saveTasks, loadTasks } from "./utils/storage.js";

const form = document.getElementById("task-form");
const titleInput = document.getElementById("task-title");
const descInput = document.getElementById("task-desc");
const dateInput = document.getElementById("task-date");
const taskList = document.getElementById("task-list");
const filterButtons = document.querySelectorAll("#filters button");

let tasks = loadTasks();
let currentFilter = "all";

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  if (!title) return;

  const task = {
    id: Date.now(),
    title,
    description: descInput.value.trim(),
    dueDate: dateInput.value,
    completed: false,
  };

  tasks.push(task);
  saveTasks(tasks);
  renderTasks();

  form.reset();
});

taskList.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li) return;
  const id = Number(li.querySelector("input[type=checkbox]").dataset.id);

  if (e.target.matches("input[type=checkbox]")) {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      task.completed = e.target.checked;
      saveTasks(tasks);
      renderTasks();
    }
  }

  if (e.target.matches(".delete-btn")) {
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks(tasks);
    renderTasks();
  }
});

filterButtons.forEach((btn) =>
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderTasks();
  })
);

function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;
  const now = new Date().toISOString().slice(0, 10);

  if (currentFilter === "completed") {
    filteredTasks = tasks.filter((t) => t.completed);
  } else if (currentFilter === "upcoming") {
    filteredTasks = tasks.filter((t) => !t.completed && t.dueDate && t.dueDate >= now);
  }

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";

    li.innerHTML = `
      <input type="checkbox" data-id="${task.id}" ${task.completed ? "checked" : ""} />
      <strong>${task.title}</strong>
      ${task.dueDate ? ` - <em>${task.dueDate}</em>` : ""}
      <p>${task.description || ""}</p>
      <button class="delete-btn" data-id="${task.id}">Delete</button>
    `;

    taskList.appendChild(li);
  });
}

renderTasks();
