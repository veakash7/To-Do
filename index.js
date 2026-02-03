import express from "express";
import { Database } from "bun:sqlite";  //Bun's native sqlite engine
import path from "path";  

const app = express();    //creating an express application
const PORT = 3000;      //port declaration where the website will be running


app.use(express.json());        //convert json to javascript object
app.use(express.static("public"));    //Makes public folder accessible to browser


const db = new Database("./db/todo.db");    //Create an database in folder db with name todo.db

db.run(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,         
    task TEXT NOT NULL,
    completed INTEGER DEFAULT 0
  )
`);

app.get("/todos", (req, res) => {                           // to fetch all the todo's list present in the database
  const todos = db.query("SELECT * FROM todos").all();
  res.json(todos);                // Send json response to browser
});

app.post("/todos", (req, res) => {      //Add new todo task
  console.log("Request body:", req.body);

  const { task } = req.body;      //extract task from json

  if (!task) {
    return res.status(400).json({ error: "Task missing" });   //If no task specified return and error
  }

  const result = db
    .query("INSERT INTO todos (task) VALUES (?)")
    .run(task);

  res.json({
    id: result.lastInsertRowid,
    task,
    completed: 0
  });
});



app.delete("/todos/:id", (req, res) => {
  db.query("DELETE FROM todos WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

app.put("/todos/:id", (req, res) => {
  const { completed } = req.body;

  db.query(
    "UPDATE todos SET completed = ? WHERE id = ?"
  ).run(completed, req.params.id);

  res.json({ success: true });
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
