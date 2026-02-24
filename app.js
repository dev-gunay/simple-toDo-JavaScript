// Simple to-do app in plain JavaScript.
// Focus: readable code and a clear data flow.

let todos = [];

// -------------------------
// DOM elements (HTML nodes)
// -------------------------

const inputElement = document.getElementById("todo-input");
const addButtonElement = document.getElementById("todo-add-button");
const listElement = document.getElementById("todo-list");
const emptyStateElement = document.getElementById("todo-empty-state");
const countElement = document.getElementById("todo-count");
const clearDoneButtonElement = document.getElementById("todo-clear-done");

if (
  !inputElement ||
  !addButtonElement ||
  !listElement ||
  !emptyStateElement ||
  !countElement ||
  !clearDoneButtonElement
) {
  alert("A required HTML element was not found. Please check the IDs.");
}

// Storage key used in localStorage for this app.
const STORAGE_KEY = "simple-todo-items-js";

// -------------------------
// Persistence (localStorage)
// -------------------------

// Load tasks from localStorage into the todos array.
// Called once on page load.
function loadTodosFromStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    todos = [];
    return;
  }

  try {
    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      todos = parsed;
    } else {
      todos = [];
    }
  } catch (error) {
    console.error("Konnte Aufgaben nicht aus dem Speicher lesen:", error);
    todos = [];
  }
}

// Save the current todos array to localStorage.
function saveTodosToStorage() {
  const raw = JSON.stringify(todos);
  localStorage.setItem(STORAGE_KEY, raw);
}


// Update the footer text: "X tasks, Y open".
function renderTodoCount() {
  const total = todos.length;
  let open = 0;

  for (let i = 0; i < todos.length; i++) {
    if (!todos[i].done) {
      open += 1;
    }
  }

  if (total === 0) {
    countElement.textContent = "0 tasks";
  } else if (open === 0) {
    countElement.textContent = total + " tasks (all done 🎉)";
  } else {
    countElement.textContent = total + " tasks, " + open + " open";
  }
}

// Create a single <li> element for one todo item.
// index = position of the todo in the todos array.
function createTodoListItem(todo, index) {
  const li = document.createElement("li");
  li.className = "todo-item";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "todo-checkbox";
  checkbox.checked = todo.done;

  const textSpan = document.createElement("span");
  textSpan.className = "todo-text";
  textSpan.textContent = todo.text;

  if (todo.done) {
    textSpan.classList.add("todo-text--done");
  }

  const deleteButton = document.createElement("button");
  deleteButton.className = "todo-delete-button";
  deleteButton.type = "button";
  deleteButton.textContent = "✕";

  checkbox.addEventListener("change", function () {
    toggleTodoDone(index);
  });

  deleteButton.addEventListener("click", function () {
    deleteTodo(index);
  });

  li.appendChild(checkbox);
  li.appendChild(textSpan);
  li.appendChild(deleteButton);

  return li;
}

// Render the full list of todos into the <ul>.
function renderTodoList() {
  if (!listElement || !emptyStateElement) {
    return;
  }

  listElement.innerHTML = "";

  if (todos.length === 0) {
    emptyStateElement.style.display = "block";
  } else {
    emptyStateElement.style.display = "none";
  }

  for (let i = 0; i < todos.length; i++) {
    const todo = todos[i];
    const li = createTodoListItem(todo, i);
    listElement.appendChild(li);
  }

  renderTodoCount();
}

// -------------------------
// Mutations (change data)
// -------------------------

// Add a new todo if the input text is not empty.
function addTodo(text) {
  const trimmedText = text.trim();

  if (trimmedText === "") {
    return;
  }

  const newTodo = {
    text: trimmedText,
    done: false,
  };

  todos.push(newTodo);

  saveTodosToStorage();
  renderTodoList();
}

// Toggle the "done" state of a todo at a given index.
function toggleTodoDone(index) {
  if (index < 0 || index >= todos.length) {
    return;
  }

  const todo = todos[index];
  todo.done = !todo.done;

  saveTodosToStorage();
  renderTodoList();
}

// Remove a todo at a given index.
function deleteTodo(index) {
  if (index < 0 || index >= todos.length) {
    return;
  }

  todos.splice(index, 1);

  saveTodosToStorage();
  renderTodoList();
}

// Remove all todos that are marked as done.
function clearDoneTodos() {
  const remaining = [];

  for (let i = 0; i < todos.length; i++) {
    const todo = todos[i];
    if (!todo.done) {
      remaining.push(todo);
    }
  }

  todos = remaining;
  saveTodosToStorage();
  renderTodoList();
}

// -------------------------
// Event helpers
// -------------------------

// Read the current input value and add it as a new todo.
function handleAddTodoFromInput() {
  if (!inputElement) {
    return;
  }

  const value = inputElement.value;
  addTodo(value);

  inputElement.value = "";
  inputElement.focus();
}

// -------------------------
// Event listeners
// -------------------------

if (addButtonElement) {
  addButtonElement.addEventListener("click", function () {
    handleAddTodoFromInput();
  });
}

if (inputElement) {
  inputElement.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddTodoFromInput();
    }
  });
}

if (clearDoneButtonElement) {
  clearDoneButtonElement.addEventListener("click", function () {
    clearDoneTodos();
  });
}

// -------------------------
// Initial startup
// -------------------------

loadTodosFromStorage();
renderTodoList();
if (inputElement) {
  inputElement.focus();
}

