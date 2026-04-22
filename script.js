// ========== Storage Key ==========
const STORAGE_KEY = "taskly-tasks";

// ========== DOM References ==========
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const counter = document.getElementById("counter");
const emptyState = document.getElementById("emptyState");

// ========== State ==========
let tasks = loadTasks();

// ========== LocalStorage Helpers ==========

/** Load tasks from localStorage, returning an empty array on failure */
function loadTasks() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/** Persist the current tasks array to localStorage */
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// ========== Rendering ==========

/** Re-render the entire task list, counter, and empty state */
function render() {
  // Clear existing list
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item" + (task.completed ? " completed" : "");

    // Checkbox button
    const checkBtn = document.createElement("button");
    checkBtn.className = "task-check";
    checkBtn.innerHTML = task.completed ? "✓" : "";
    checkBtn.addEventListener("click", () => toggleTask(task.id));

    // Task text
    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = task.text;

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.className = "task-delete";
    delBtn.textContent = "✕";
    delBtn.addEventListener("click", () => deleteTask(task.id));

    li.append(checkBtn, span, delBtn);
    taskList.appendChild(li);
  });

  // Update counter visibility and text
  const completedCount = tasks.filter((t) => t.completed).length;
  if (tasks.length > 0) {
    counter.style.display = "flex";
    counter.innerHTML =
      '<span class="total">' + tasks.length + " task" + (tasks.length !== 1 ? "s" : "") + "</span>" +
      '<span class="completed">' + completedCount + " completed</span>";
  } else {
    counter.style.display = "none";
  }

  // Toggle empty state
  emptyState.style.display = tasks.length === 0 ? "block" : "none";
}

// ========== Task Actions ==========

/** Add a new task from the input field */
function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.unshift({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    text: text,
    completed: false,
  });

  taskInput.value = "";
  saveTasks();
  render();
}

/** Toggle completed state of a task by id */
function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) task.completed = !task.completed;
  saveTasks();
  render();
}

/** Delete a task by id */
function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  render();
}

// ========== Event Listeners ==========

addBtn.addEventListener("click", addTask);

// Allow pressing Enter to add a task
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

// ========== Initial Render ==========
render();
