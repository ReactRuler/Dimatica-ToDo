# Todo Task Backend

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![TypeScript](https://img.shields.io/badge/TypeScript-✔%EF%B8%8F-blue)
![Express.js](https://img.shields.io/badge/Express.js-%23404d59.svg?logo=express&logoColor=%2361DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-%23336791.svg?logo=postgresql&logoColor=white)
![CORS](https://img.shields.io/badge/CORS-enabled-brightgreen)

---

## Overview

This is the backend API for the Todo Task project, built with Express.js and TypeScript. It provides RESTful endpoints to manage todos and their subtasks, persisting data in a PostgreSQL database. CORS is enabled to allow cross-origin requests from the frontend.

---

## Features

- CRUD operations for todos and subtasks.
- Nested retrieval of todos with their subtasks.
- Uses PostgreSQL for data persistence.
- Environment configuration via `.env` file.
- CORS enabled for all origins.

---

## API Endpoints

### GET `/todos`

- Retrieves all todos with their associated subtasks.
- Response: Array of todos, each including a `sub_todos` array.

### POST `/todos`

- Creates a new todo.
- Request body:
  ```json
  {
    "title": "string",
    "description": "string",
    "completed": "boolean" // optional, defaults to false
  }
  ```
- Response: Created todo object.

### POST `/sub_todos`

- Creates a new subtask for a todo.
- Request body:
  ```json
  {
    "todo_id": "number",
    "sub_task_description": "string",
    "completed": "boolean" // optional, defaults to false
  }
  ```
- Response: Created subtask object.

### DELETE `/todos/:id`

- Deletes a todo by ID.
- Response: 204 No Content on success.

### DELETE `/sub_todos/:id`

- Deletes a subtask by ID.
- Response: 204 No Content on success.

### PUT `/todos/:id`

- Updates a todo by ID.
- Request body:
  ```json
  {
    "title": "string",
    "description": "string",
    "completed": "boolean"
  }
  ```
- Response: Success message.

### PUT `/sub_todos/:id`

- Updates a subtask by ID.
- Request body:
  ```json
  {
    "sub_task_description": "string",
    "completed": "boolean"
  }
  ```
- Response: Success message.

---

## Data Models

### Todo

| Field       | Type      | Description                  |
| ----------- | --------- | ---------------------------- |
| id          | number    | Unique identifier            |
| title       | string    | Todo title                   |
| description | string    | Todo description             |
| completed   | boolean   | Completion status            |
| created_at  | string    | Timestamp of creation        |
| updated_at  | string    | Timestamp of last update     |
| sub_todos   | SubTodo[] | Array of associated subtasks |

### SubTodo

| Field                | Type    | Description              |
| -------------------- | ------- | ------------------------ |
| id                   | number  | Unique identifier        |
| sub_task_description | string  | Subtask description      |
| completed            | boolean | Completion status        |
| created_at           | string  | Timestamp of creation    |
| updated_at           | string  | Timestamp of last update |

---

## Environment Variables

The backend expects the following environment variables (typically in a `.env` file):

- `PORT` - Port number for the server (default: 3000)
- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port
- `DB_USER` - PostgreSQL user
- `DB_PASSWORD` - PostgreSQL password
- `DB_DATABASE` - PostgreSQL database name

---

## Installation & Running

1. Clone the repository.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file with the required environment variables.
4. Start the server:

   ```bash
   npm start
   ```

5. The server will run at `http://localhost:<PORT>` (default 3000).

---

## Dependencies

- Express.js
- TypeScript
- pg (PostgreSQL client)
- dotenv
- cors

---

## Notes

- The API returns JSON responses.
- Proper error handling returns HTTP 500 with error messages on failures.
- The `/todos` GET endpoint returns todos with nested subtasks using a JSON aggregation query.
