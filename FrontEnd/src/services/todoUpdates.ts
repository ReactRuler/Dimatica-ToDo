export async function updateTodoCompletion(
  id: number,
  title: string,
  description: string,
  completed: boolean
) {
  try {
    const response = await fetch(`http://localhost:3000/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, completed }),
    });
    if (!response.ok) {
      throw new Error("Failed to update todo");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating todo:", error);
    throw error;
  }
}

export async function updateSubTodoCompletion(
  id: number,
  sub_task_description: string,
  completed: boolean
) {
  try {
    const response = await fetch(`http://localhost:3000/sub_todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sub_task_description, completed }),
    });
    if (!response.ok) {
      throw new Error("Failed to update sub-todo");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating sub-todo:", error);
    throw error;
  }
}
