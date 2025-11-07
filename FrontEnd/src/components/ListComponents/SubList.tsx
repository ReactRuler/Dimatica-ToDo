import { List, Switch, Button, Popover, Input } from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { runes } from "runes2";
import { useState } from "react";

export default function SubList({
  sub_todos,
  onSubTodoUpdate,
  onDeleteSubTodo: deleteSubTodo,
}: {
  sub_todos: {
    id: number;
    sub_task_description: string;
    completed: boolean;
  }[];
  onSubTodoUpdate: (
    id: number,
    sub_task_description: string,
    completed: boolean
  ) => Promise<void>;
}) {
  if (!sub_todos?.length) return null;

  const popOverSubTodos = ({
    id,
    sub_task_description,
    completed,
  }: {
    id: number;
    sub_task_description: string;
    completed: boolean;
  }) => {
    const [editedTask, setEditedTask] = useState(sub_task_description);

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
          value={editedTask}
          onChange={(e) => setEditedTask(e.target.value)}
          placeholder="🫧 Buy soap"
        />
        <Button
          onClick={() => onSubTodoUpdate(id, editedTask, completed)}
          color="green"
          variant="solid"
        >
          <SaveOutlined /> Save
        </Button>
      </div>
    );
  };

  return (
    <div className="w-full">
      <List
        size="large"
        dataSource={sub_todos}
        renderItem={(item) => (
          <List.Item>
            <div className="flex flex-row gap-10 items-center w-full">
              <Switch
                onChange={() =>
                  onSubTodoUpdate(
                    item.id,
                    item.sub_task_description,
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
                <div className="font-semibold">{item.sub_task_description}</div>
              </div>
              <Popover
                content={() =>
                  popOverSubTodos({
                    id: item.id,
                    sub_task_description: item.sub_task_description,
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
              <Button danger onClick={() => deleteSubTodo(item.id)}>
                Delete <DeleteOutlined />
              </Button>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
}
