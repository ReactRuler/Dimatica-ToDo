import express from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = Number(process.env.PORT) || 3000;
const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});
app.use(express.json());
app.get("/todos", async (_req, res) => {
    try {
        const result = await pool.query(`
      SELECT
        todos.id,
        todos.title,
        todos.description,
        todos.completed,
        todos.created_at,
        todos.updated_at,
        COALESCE(
          json_agg(
            json_build_object(
              'id', sub_todos.id,
              'sub_task_description', sub_todos.sub_task_description,
              'completed', sub_todos.completed,
              'created_at', sub_todos.created_at,
              'updated_at', sub_todos.updated_at
            )
          ) FILTER (WHERE sub_todos.id IS NOT NULL), '[]'
        ) AS sub_todos
      FROM todos
      LEFT JOIN sub_todos ON todos.id = sub_todos.todo_id
      GROUP BY todos.id
      ORDER BY todos.created_at DESC
    `);
        console.log("Query result:", result);
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error("Error fetching todos:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
app.post("/todos", async (req, res) => {
    const { title, description, completed } = req.body;
    try {
        const result = await pool.query("INSERT INTO todos (title, description, completed) VALUES ($1, $2, $3) RETURNING *", [title, description, completed || false]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error("Error creating todo:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
app.post("/sub_todos", async (req, res) => {
    const { todo_id, sub_task_description, completed } = req.body;
    try {
        const result = await pool.query("INSERT INTO sub_todos (todo_id, sub_task_description, completed) VALUES ($1, $2, $3) RETURNING *", [todo_id, sub_task_description, completed || false]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error("Error creating sub_todo:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
app.delete("/todos/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM todos WHERE id = $1", [id]);
        res.status(204).send();
    }
    catch (error) {
        console.error("Error deleting todo:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
app.delete("/sub_todos/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM sub_todos WHERE id = $1", [id]);
        res.status(204).send();
    }
    catch (error) {
        console.error("Error deleting sub_todo:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
export default app;
//# sourceMappingURL=server.js.map