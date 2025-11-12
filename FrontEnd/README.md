# Todo Task Frontend

![React](https://img.shields.io/badge/React-18%2B-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-✔%EF%B8%8F-blue)
![Ant Design](https://img.shields.io/badge/Ant%20Design-%23408eea.svg?logo=ant-design&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)

---

## Overview

This is the frontend application for the Todo Task project. It is built with React and TypeScript, using Ant Design for UI components. The app allows users to create, update, delete, and manage todos and their subtasks, communicating with a backend API.

---

## Features

- Display a list of todos with titles, descriptions, and completion status.
- Create new todos and subtasks via intuitive popover forms.
- Edit existing todos inline with live updates.
- Toggle completion status for todos and subtasks.
- Delete todos and subtasks.
- Responsive UI with Ant Design components and icons.
- Unicode-safe input handling using `runes2`.

---

## Component Structure

### MainList

- Manages state for todos and loading status.
- Fetches todos from backend API.
- Handles CRUD operations for todos and subtasks.
- Renders UI with Ant Design components:
  - `List`, `Switch`, `Collapse`, `Input`, `Popover`, `Button`
- Uses `SubList` component to render subtasks.

### SubList

- Renders subtasks for a given todo.
- Supports toggling completion and deleting subtasks.

---

## Backend API Endpoints Used

- `GET /todos` - Fetch all todos with subtasks.
- `POST /todos` - Create a new todo.
- `PUT /todos/:id` - Update a todo.
- `DELETE /todos/:id` - Delete a todo.
- `POST /sub_todos` - Create a new subtask.
- `PUT /sub_todos/:id` - Update a subtask.
- `DELETE /sub_todos/:id` - Delete a subtask.

---

## Installation & Running

1. Clone the repository.

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. The app will be available at `http://localhost:3000` (or your configured port).

---

## Testing

- Tests are written using Jest and React Testing Library.

- To run tests:

  ```bash
  npm test
  ```

## Dependencies

- React 18+
- TypeScript
- Ant Design
- runes2 (for Unicode-safe string operations)
- Jest & React Testing Library (for testing)

---

If you need documentation for other components or help with setup, just ask!
