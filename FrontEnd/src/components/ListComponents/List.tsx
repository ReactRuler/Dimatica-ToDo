import { List, Switch, Collapse, Input, Popover, Button } from "antd";
import {
  CaretRightOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import SubList from "./SubList";
import { updateTodoData } from "../../services/todoUpdates";
import { useEffect, useState } from "react";
import { runes } from "runes2";

function MainList() {
  const [todos, setTodos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function loadTodos() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/todos");
      const data = await res.json();
      setTodos(data);
      console.log("Todos loaded:", data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
    setLoading(false);
  }

  async function updateTodo(
    id: number,
    title: string,
    description: string,
    completed: boolean
  ) {
    try {
      await updateTodoData(id, title, description, completed);
      await loadTodos();
    } catch (error) {
      console.error("Failed to update todo completion status", error);
    }
  }

  async function deleteTodo(id: number) {
    try {
      const response = await fetch(`http://localhost:3000/todos/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }
      await loadTodos();
    } catch (error) {
      console.error("Failed to delete todo", error);
    }
  }

  async function onSubTodoUpdate(
    id: number,
    sub_task_description: string,
    completed: boolean
  ) {
    try {
      const response = await fetch(`http://localhost:3000/sub_todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sub_task_description, completed }),
      });
      if (!response.ok) {
        throw new Error("Failed to update sub-todo");
      }
      await loadTodos();
    } catch (error) {
      console.error("Failed to update sub-todo completion status", error);
    }
  }

  useEffect(() => {
    loadTodos();
  }, []);

  async function createTodo(title: string, description: string) {
    try {
      const response = await fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, completed: false }),
      });
      if (!response.ok) {
        throw new Error("Failed to create todo");
      }
      await loadTodos();
    } catch (error) {
      console.error("Failed to create todo", error);
    }
  }

  async function addSubTask(todo_id: number, sub_task_description: string) {
    console.log("todo_id:", todo_id);
    console.log("sub_task_description:", sub_task_description);
    try {
      const response = await fetch("http://localhost:3000/sub_todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          todo_id,
          sub_task_description,
          completed: false,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to add sub-task");
      }
      await loadTodos();
    } catch (error) {
      console.error("Failed to add sub-task", error);
    }
  }

  const popOverTodos = ({
    id,
    title,
    description,
    completed,
  }: {
    id: number;
    title: string;
    description: string;
    completed: boolean;
  }) => {
    const [editedTitle, setEditedTitle] = useState(title);
    const [editedDescription, setEditedDescription] = useState(description);

    return (
      <div className="flex flex-col gap-5 w-[450px]">
        <Input
          count={{
            show: true,
            max: 25,
            strategy: (txt) => runes(txt).length,
            exceedFormatter: (txt, { max }) =>
              runes(txt).slice(0, max).join(""),
          }}
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          placeholder="🕐 What's on your mind?"
        />
        <Input
          count={{
            show: true,
            max: 50,
            strategy: (txt) => runes(txt).length,
            exceedFormatter: (txt, { max }) =>
              runes(txt).slice(0, max).join(""),
          }}
          value={editedDescription}
          placeholder="🧽 Describe your task 📚"
          onChange={(e) => setEditedDescription(e.target.value)}
        />
        <Button
          onClick={() =>
            updateTodo(id, editedTitle, editedDescription, completed)
          }
          color="green"
          variant="solid"
        >
          <SaveOutlined /> Save
        </Button>
      </div>
    );
  };

  const popOverCreateTodo = () => {
    const [editedTitle, setEditedTitle] = useState("");
    const [editedDescription, setEditedDescription] = useState("");

    return (
      <div className="flex flex-col gap-5 w-[450px]">
        <Input
          count={{
            show: true,
            max: 25,
            strategy: (txt) => runes(txt).length,
            exceedFormatter: (txt, { max }) =>
              runes(txt).slice(0, max).join(""),
          }}
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          placeholder="🕐 What's on your mind?"
        />
        <Input
          count={{
            show: true,
            max: 50,
            strategy: (txt) => runes(txt).length,
            exceedFormatter: (txt, { max }) =>
              runes(txt).slice(0, max).join(""),
          }}
          value={editedDescription}
          placeholder="🧽 Describe your task 📚"
          onChange={(e) => setEditedDescription(e.target.value)}
        />
        <Button
          onClick={() => createTodo(editedTitle, editedDescription)}
          color="green"
          variant="solid"
        >
          <PlusCircleOutlined /> Add new
        </Button>
      </div>
    );
  };

  const popOverCreateSubTodo = ({ todo_id }: { todo_id: number }) => {
    const [editedSubTask, setEditedSubTask] = useState("");
    const todoId = todo_id;

    return (
      <div className="flex flex-col gap-5 w-[450px]">
        <Input
          count={{
            show: true,
            max: 30,
            strategy: (txt) => runes(txt).length,
            exceedFormatter: (txt, { max }) =>
              runes(txt).slice(0, max).join(""),
          }}
          value={editedSubTask}
          placeholder="🧽 Describe your sub task 📚"
          onChange={(e) => setEditedSubTask(e.target.value)}
        />
        <Button
          onClick={() => addSubTask(todoId, editedSubTask)}
          color="green"
          variant="solid"
        >
          <PlusCircleOutlined /> Add new sub task
        </Button>
      </div>
    );
  };

  async function deleteSubTodo(id: number) {
    try {
      const response = await fetch(`http://localhost:3000/sub_todos/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete sub-todo");
      }
    } catch (error) {
      console.error("Error deleting sub-todo:", error);
    }
    await loadTodos();
  }

  return (
    <div className="w-full">
      <Popover
        content={() => popOverCreateTodo()}
        title="Create Todo"
        trigger="click"
      >
        <Button>
          Create <PlusCircleOutlined />
        </Button>
      </Popover>
      <List
        size="large"
        bordered
        loading={loading}
        dataSource={todos}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <div className="flex flex-row gap-10 items-center w-full">
              <Switch
                onChange={() =>
                  updateTodo(
                    item.id,
                    item.title,
                    item.description,
                    !item.completed
                  )
                }
                style={{
                  backgroundColor: item.completed ? "#A1DD70" : "#ED3F27",
                }}
                className={`${
                  item.completed
                    ? "shadow-lg shadow-green-500/50"
                    : "shadow-lg shadow-red-500/50"
                } transition-all duration-1000 ease-in-out`}
                checked={item.completed}
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
              />
              <div className="flex flex-col gap-1 flex-1">
                <div className="font-semibold">{item.title}</div>
                <div className="text-gray-700">{item.description}</div>
              </div>
              <div className="flex gap-2">
                <Popover
                  content={() =>
                    popOverTodos({
                      id: item.id,
                      title: item.title,
                      description: item.description,
                      completed: item.completed,
                    })
                  }
                  title="Edit Todo"
                  trigger="click"
                >
                  <Button>
                    Edit <EditOutlined />
                  </Button>
                </Popover>
                <Button danger onClick={() => deleteTodo(item.id)}>
                  Delete <DeleteOutlined />
                </Button>
              </div>
              <div className="flex-1">
                <Popover
                  content={() => popOverCreateSubTodo({ todo_id: item.id })}
                  title="Create Sub Todo"
                  trigger="click"
                >
                  <Button>
                    Create Sub Todo <PlusCircleOutlined />
                  </Button>
                </Popover>
                {item.sub_todos?.length > 0 && (
                  <Collapse
                    style={{ background: "transparent" }}
                    bordered={false}
                    expandIcon={({ isActive }) => (
                      <CaretRightOutlined rotate={isActive ? 90 : 0} />
                    )}
                    items={[
                      {
                        key: "1",
                        label: "Additional Tasks",
                        children: (
                          <SubList
                            sub_todos={item.sub_todos}
                            onSubTodoUpdate={onSubTodoUpdate}
                            onDeleteSubTodo={deleteSubTodo}
                          />
                        ),
                      },
                    ]}
                  />
                )}
              </div>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
}

export default MainList;
