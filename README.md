# 📝 Todo App (Bun + Express + SQLite)

A basic full-stack Todo application built using **HTML, CSS, JavaScript**, **Bun**, **Express**, and **SQLite**.  
This project demonstrates how a frontend communicates with a backend server and persists data using a database.

---

## ✨ Features

- ➕ Add new todos  
- ✅ Mark todos as completed  
- ✏️ Edit existing todos  
- ❌ Delete todos  
- 💾 Persistent storage using SQLite  
- 🎨 Clean and responsive UI  

---

## 🧰 Tech Stack

### Frontend
- HTML
- CSS
- JavaScript (Vanilla)

### Backend
- Bun (JavaScript runtime)
- Express (Web framework)

### Database
- SQLite (Recommended)
- PostgreSQL (Optional for production)

---

## 📁 Project Structure

todo-app/
│
├── public/ ← Frontend files (served to browser)
│ ├── index.html ← UI structure
│ ├── styles.css ← UI styling
│ └── scripts.js ← Frontend logic
│
├── db/ ← Database folder
│ └── todo.db ← SQLite database file
│
├── index.js ← Backend server (Express + Bun)
├── package.json ← Project metadata & dependencies
└── README.md ← Project documentation

## 📄 File Responsibilities

### `index.html`
- Defines the structure of the user interface (UI)
- Contains the input field, buttons, and todo list container
- Links the CSS and JavaScript files
- Contains **no business logic** (only markup)

---

### `styles.css`
- Controls the visual appearance of the application
- Manages layout, spacing, fonts, colors, shadows, and responsiveness
- Enhances user experience with a clean and aesthetically pleasing design
- Does **not** handle data or logic

---

### `scripts.js`
- Acts as the **brain of the frontend**
- Handles:
  - Button click events
  - Checkbox state changes (completed / not completed)
  - Edit actions for todos
  - Fetch API calls to the backend
  - DOM manipulation and UI updates
- Communicates with the backend using HTTP requests (`GET`, `POST`, `PUT`, `DELETE`)

---

### `index.js`
- Contains the backend server logic
- Uses **Express** to:
  - Serve frontend files from the `public` folder
  - Define REST API endpoints (`GET`, `POST`, `PUT`, `DELETE`)
- Uses **SQLite** to:
  - Store todos
  - Read todos
  - Update todos
  - Delete todos
