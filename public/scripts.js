async function fetchTodos() {
  const res = await fetch("/todos");
  const todos = await res.json();

  const list = document.getElementById("todoList");
  list.innerHTML = "";

  todos.forEach(todo => {
    const li = document.createElement("li");
    li.className = todo.completed ? "completed" : "";

    
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = !!todo.completed;
    checkbox.onchange = () =>
      toggleCompleted(todo.id, checkbox.checked);

    
    const span = document.createElement("span");
    span.textContent = todo.task;
    span.onclick = () => editTodo(todo.id, span);

    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.onclick = () => deleteTodo(todo.id);

    li.append(checkbox, span, delBtn);
    list.appendChild(li);
  });
}

async function addTodo() {
  const input = document.getElementById("taskInput");
  const task = input.value.trim();

  if (!task) return;

  await fetch("/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task })
  });

  input.value = "";
  fetchTodos();
}

async function deleteTodo(id) {
  await fetch(`/todos/${id}`, { method: "DELETE" });
  fetchTodos();
}

async function toggleCompleted(id, completed) {
  await fetch(`/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: completed ? 1 : 0 })
  });
  fetchTodos();
}

function editTodo(id, span) {
  const newTask = prompt("Edit task:", span.textContent);
  if (!newTask) return;

  fetch(`/todos/${id}/edit`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task: newTask })
  }).then(fetchTodos);
}

fetchTodos();
