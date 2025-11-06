import express, { type Request, type Response } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port: number = Number(process.env.PORT) || 3000;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

app.use(express.json());

interface SubTodo {
  id: number;
  sub_task_description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  sub_todos: SubTodo[];
}

app.get("/todos", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query<Todo>(`
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
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post(
  "/todos",
  async (
    req: Request<
      {},
      {},
      { title?: string; description?: string; completed?: boolean }
    >,
    res: Response
  ) => {
    const { title, description, completed } = req.body;
    try {
      const result = await pool.query(
        "INSERT INTO todos (title, description, completed) VALUES ($1, $2, $3) RETURNING *",
        [title, description, completed || false]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.post(
  "/sub_todos",
  async (
    req: Request<
      {},
      {},
      { todo_id: number; sub_task_description: string; completed?: boolean }
    >,
    res: Response
  ) => {
    const { todo_id, sub_task_description, completed } = req.body;
    try {
      const result = await pool.query(
        "INSERT INTO sub_todos (todo_id, sub_task_description, completed) VALUES ($1, $2, $3) RETURNING *",
        [todo_id, sub_task_description, completed || false]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.delete(
  "/todos/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    try {
      await pool.query("DELETE FROM todos WHERE id = $1", [id]);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.delete(
  "/sub_todos/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    try {
      await pool.query("DELETE FROM sub_todos WHERE id = $1", [id]);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.put(
  "/todos/:id",
  async (
    req: Request<{
      id: string;
      title?: string;
      description?: string;
      completed?: boolean;
    }>,
    res: Response
  ) => {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    try {
      await pool.query(
        "UPDATE todos SET title = $1, description = $2, completed = $3, updated_at = NOW() WHERE id = $4",
        [title, description, completed, id]
      );
      res.status(200).json({ message: "Todo updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.put(
  "/sub_todos/:id",
  async (
    req: Request<{
      id: number;
      sub_task_desciption?: string;
      completed?: boolean;
    }>,
    res: Response
  ) => {
    const { id } = req.params;
    const { sub_task_desciption, completed } = req.body;
    try {
      await pool.query(
        "UPDATE sub_todos SET sub_task_description = $1, completed = $2, updated_at = NOW() WHERE id = $3",
        [sub_task_desciption, completed, id]
      );
      res.status(200).json({ message: "SubTodo updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.listen(port, () => {
  console.log(`Server running http://localhost:${port}`);
});

export default app;
