import { List, Switch, Collapse } from "antd";
import {
  CaretRightOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import SubList from "./SubList";
import { updateTodoCompletion } from "../../services/todoUpdates";
import { useEffect, useState } from "react";

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

  async function handleToggle(
    id: number,
    title: string,
    description: string,
    completed: boolean
  ) {
    try {
      await updateTodoCompletion(id, title, description, completed);
      await loadTodos();
    } catch (error) {
      console.error("Failed to update todo completion status", error);
    }
  }

  async function subTodoToggle(
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

  return (
    <div className="w-full">
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
                  handleToggle(
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
              <div className="flex-1">
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
                            onSubTodoToggle={subTodoToggle}
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
