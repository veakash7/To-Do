import { serve } from "bun";
import sqlite3 from "sqlite3";
import { join } from "path";

const DB_PATH = join(process.cwd(), "data", "todos.db");

// Initialize database
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("❌ Database connection error:", err);
    process.exit(1);
  }
  console.log("✅ Database initialized at", DB_PATH);
});

// Enable foreign keys
db.run("PRAGMA foreign_keys = ON");

// Create tables if they don't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      priority TEXT DEFAULT 'medium',
      dueDate TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS analytics (
      id INTEGER PRIMARY KEY,
      totalTasks INTEGER DEFAULT 0,
      completedTasks INTEGER DEFAULT 0,
      activeTasks INTEGER DEFAULT 0,
      highPriorityTasks INTEGER DEFAULT 0,
      lastUpdated TEXT NOT NULL
    )
  `);

  db.run(`CREATE INDEX IF NOT EXISTS idx_completed ON todos(completed)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_priority ON todos(priority)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_dueDate ON todos(dueDate)`);
});

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

function updateAnalytics() {
  return new Promise((resolve) => {
    db.all(
      `SELECT 
        COUNT(*) as totalTasks,
        SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completedTasks,
        SUM(CASE WHEN completed = 0 THEN 1 ELSE 0 END) as activeTasks,
        SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) as highPriorityTasks
       FROM todos`,
      (err, rows) => {
        if (err) {
          console.error("Analytics error:", err);
          resolve();
          return;
        }

        const data = rows[0] || {};
        db.run(
          `INSERT OR REPLACE INTO analytics (id, totalTasks, completedTasks, activeTasks, highPriorityTasks, lastUpdated)
           VALUES (1, ?, ?, ?, ?, ?)`,
          [data.totalTasks || 0, data.completedTasks || 0, data.activeTasks || 0, data.highPriorityTasks || 0, new Date().toISOString()],
          () => resolve()
        );
      }
    );
  });
}

serve({
  port: 3000,

  async fetch(req) {
    const url = new URL(req.url);
    const { pathname } = url;

    if (!pathname.startsWith("/api")) {
      return new Response(
        Bun.file(`public${pathname === "/" ? "/index.html" : pathname}`)
      );
    }

    try {
      // GET /api/todos
      if (req.method === "GET" && pathname === "/api/todos") {
        return new Promise((resolve) => {
          db.all("SELECT * FROM todos ORDER BY createdAt DESC", (err, todos) => {
            if (err) {
              resolve(json({ error: err.message }, 500));
            } else {
              resolve(json(todos || []));
            }
          });
        });
      }

      // POST /api/todos
      if (req.method === "POST" && pathname === "/api/todos") {
        const body = await req.json();
        if (!body.title) return json({ message: "Title required" }, 400);

        const id = crypto.randomUUID();
        const now = new Date().toISOString();

        return new Promise((resolve) => {
          db.run(
            `INSERT INTO todos (id, title, completed, priority, dueDate, createdAt, updatedAt)
             VALUES (?, ?, 0, ?, ?, ?, ?)`,
            [id, body.title, body.priority || "medium", body.dueDate || null, now, now],
            async function (err) {
              if (err) {
                resolve(json({ error: err.message }, 500));
              } else {
                await updateAnalytics();
                resolve(json({
                  id,
                  title: body.title,
                  completed: false,
                  priority: body.priority || "medium",
                  dueDate: body.dueDate || null,
                  createdAt: now,
                  updatedAt: now
                }, 201));
              }
            }
          );
        });
      }

      // PUT /api/todos/:id
      if (req.method === "PUT" && pathname.startsWith("/api/todos/")) {
        const id = pathname.split("/").pop();
        const body = await req.json();

        return new Promise((resolve) => {
          db.get("SELECT * FROM todos WHERE id = ?", [id], (err, todo) => {
            if (err) {
              resolve(json({ error: err.message }, 500));
            } else if (!todo) {
              resolve(json({ message: "Not found" }, 404));
            } else {
              const updates = {
                title: body.title !== undefined ? body.title : todo.title,
                completed: body.completed !== undefined ? (body.completed ? 1 : 0) : todo.completed,
                priority: body.priority || todo.priority,
                dueDate: body.dueDate !== undefined ? body.dueDate : todo.dueDate,
                updatedAt: new Date().toISOString()
              };

              db.run(
                `UPDATE todos SET title = ?, completed = ?, priority = ?, dueDate = ?, updatedAt = ? WHERE id = ?`,
                [updates.title, updates.completed, updates.priority, updates.dueDate, updates.updatedAt, id],
                async (err) => {
                  if (err) {
                    resolve(json({ error: err.message }, 500));
                  } else {
                    await updateAnalytics();
                    resolve(json({ ...todo, ...updates }));
                  }
                }
              );
            }
          });
        });
      }

      // DELETE /api/todos/:id
      if (req.method === "DELETE" && pathname.startsWith("/api/todos/")) {
        const id = pathname.split("/").pop();

        return new Promise((resolve) => {
          db.run("DELETE FROM todos WHERE id = ?", [id], async (err) => {
            if (err) {
              resolve(json({ error: err.message }, 500));
            } else {
              await updateAnalytics();
              resolve(json({ message: "Deleted" }));
            }
          });
        });
      }

      // GET /api/analytics
      if (req.method === "GET" && pathname === "/api/analytics") {
        return new Promise((resolve) => {
          db.get(
            `SELECT 
              COALESCE((SELECT COUNT(*) FROM todos), 0) as totalTasks,
              COALESCE((SELECT COUNT(*) FROM todos WHERE completed = 1), 0) as completedTasks,
              COALESCE((SELECT COUNT(*) FROM todos WHERE completed = 0), 0) as activeTasks,
              COALESCE((SELECT COUNT(*) FROM todos WHERE priority = 'high'), 0) as highPriorityTasks,
              COALESCE((SELECT COUNT(*) FROM todos WHERE priority = 'medium'), 0) as mediumPriorityTasks,
              COALESCE((SELECT COUNT(*) FROM todos WHERE priority = 'low'), 0) as lowPriorityTasks,
              COALESCE(ROUND((SELECT COUNT(*) FROM todos WHERE completed = 1) * 100.0 / 
                NULLIF((SELECT COUNT(*) FROM todos), 0)), 0) as completionRate,
              COALESCE((SELECT COUNT(*) FROM todos WHERE dueDate IS NOT NULL AND dueDate <= date('now', '+3 days') AND completed = 0), 0) as dueSoonTasks
            FROM todos LIMIT 1`,
            (err, data) => {
              if (err) {
                resolve(json({ error: err.message }, 500));
              } else {
                resolve(json(data || {}));
              }
            }
          );
        });
      }

      return json({ message: "Not found" }, 404);
    } catch (err) {
      console.error("❌ Server error:", err);
      return json({ message: "Server error", error: err.message }, 500);
    }
  }
});

console.log("🚀 TaskPro server running on http://localhost:3000");
