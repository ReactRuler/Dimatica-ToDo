"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 3000;
const pool = new pg_1.Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});
app.use(express_1.default.json());
app.get("/todos", async (req, res) => {
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
exports.default = app;
//# sourceMappingURL=server.js.map