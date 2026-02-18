# 📝 TaskPro - Todo App (Bun + SQLite)

A modern, full-stack Todo application built with **HTML, CSS, JavaScript**, **Bun**, and **SQLite**.  
Features multiple views, dark mode, animations, and comprehensive analytics powered by SQLite.

---

## ✨ Features

### Core Functionality
- ➕ Add new tasks with priority levels and due dates
- ✅ Mark tasks as completed  
- ✏️ Edit existing tasks  
- ❌ Delete tasks  
- 💾 Persistent storage using SQLite database
- 📊 Real-time analytics and statistics

### UI/UX Features
- 🎨 Multiple view modes (List, Board, Calendar, Statistics)
- 🌙 Dark mode toggle with localStorage persistence
- 🔍 Search functionality to find tasks
- 🏷️ Filter tasks by completion status and priority
- ✨ Smooth animations and transitions
- 📱 Fully responsive design
- ⚡ Optimized performance

---

## 🧰 Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Custom design with variables, animations, and responsive grid
- **JavaScript (ES6+)** - Vanilla JS with modules

### Backend
- **Bun** - Fast JavaScript runtime
- **SQLite3** - Lightweight relational database

### Database Schema
```sql
-- Tasks Table
CREATE TABLE todos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  completed INTEGER DEFAULT 0,
  priority TEXT DEFAULT 'medium',
  dueDate TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

-- Analytics Table
CREATE TABLE analytics (
  id INTEGER PRIMARY KEY,
  totalTasks INTEGER DEFAULT 0,
  completedTasks INTEGER DEFAULT 0,
  activeTasks INTEGER DEFAULT 0,
  highPriorityTasks INTEGER DEFAULT 0,
  lastUpdated TEXT NOT NULL
);
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js/Bun installed
- npm or bun package manager

### Steps

1. **Clone/Navigate to project**
   ```bash
   cd "To Do"
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Create data directory** (automatically created on first run)
   ```bash
   mkdir -p data
   ```

4. **Start the server**
   ```bash
   bun server.js
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

---

## 📡 API Endpoints

### Todos
- `GET /api/todos` - Get all tasks
- `POST /api/todos` - Create new task
- `PUT /api/todos/:id` - Update task
- `DELETE /api/todos/:id` - Delete task

### Analytics
- `GET /api/analytics` - Get comprehensive analytics data

### Request/Response Examples

**Create Task:**
```bash
POST /api/todos
Content-Type: application/json

{
  "title": "Buy groceries",
  "priority": "high",
  "dueDate": "2026-02-25"
}
```

**Response:**
```json
{
  "id": "uuid-string",
  "title": "Buy groceries",
  "completed": 0,
  "priority": "high",
  "dueDate": "2026-02-25",
  "createdAt": "2026-02-18T...",
  "updatedAt": "2026-02-18T..."
}
```

**Analytics Response:**
```json
{
  "totalTasks": 5,
  "completedTasks": 2,
  "activeTasks": 3,
  "highPriorityTasks": 1,
  "mediumPriorityTasks": 3,
  "lowPriorityTasks": 1,
  "completionRate": 40,
  "dueSoonTasks": 1
}
```

---

## 📁 Project Structure

```
To Do/
├── server.js                 # Bun server with SQLite integration
├── package.json              # Dependencies (sqlite3)
├── README.md                 # This file
├── data/
│   └── todos.db              # SQLite database (auto-created)
└── public/
    ├── index.html            # Main app HTML
    ├── styles.css            # App styling with animations
    ├── app.js                # Main application logic
    ├── state.js              # Global app state
    ├── api.js                # API client
    └── views/
        ├── listView.js       # List view component
        ├── boardView.js      # Kanban board component
        ├── calendarView.js   # Calendar view component
        └── statsView.js      # Analytics dashboard
```

---

## 🎨 Views

### List View
Shows all tasks in a clean list format with checkboxes, priority badges, and due dates.

### Board View
Kanban-style board with columns for different task statuses.

### Calendar View
Tasks displayed in a calendar grid with date-based organization.

### Statistics View
Comprehensive dashboard showing:
- Total, active, and completed tasks
- Priority breakdown with visual progress bars
- Completion rate percentage
- Due soon task count

---

## 🛠️ Development

### Adding a New Task
1. User enters title and selects priority/due date
2. Click "Add Task" button
3. API `POST /api/todos` creates task in SQLite
4. Analytics automatically update
5. View refreshes to show new task

### Database Features
- **ACID Compliance**: SQLite ensures data integrity
- **Auto-indexing**: Indexes on commonly queried columns
- **Persistence**: Data survives server restarts
- **Analytics Caching**: Real-time aggregation via SQL queries

### Modifying Analytics
Edit the SQL query in `server.js` line ~185 to customize analytics calculations.

---

## 📝 Notes

- Database file (`todos.db`) is created automatically in `/data` folder
- All timestamps use ISO 8601 format
- Task IDs are UUIDs generated client-side
- Analytics update whenever tasks change
- Dark mode preference saved to browser localStorage

---

## 🔒 Data Persistence

Tasks and analytics are stored in a SQLite database at `data/todos.db`:
```bash
SQLite database (todos.db)
├── todos table (task records)
└── analytics table (aggregated stats)
```

---

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
# Kill process using port 3000
Get-Process -Name bun | Stop-Process -Force
```

### Database locked error
Ensure only one server instance is running.

### Tasks not appearing
Check browser console (F12) for API errors.

---

## 📄 License

MIT License - Feel free to use and modify

---

**Last Updated**: February 18, 2026  
**Version**: 2.0.0 (SQLite Integration)
- SQLite (Recommended)
- PostgreSQL (Optional for production)

---
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
