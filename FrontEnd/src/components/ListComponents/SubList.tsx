import { List, Switch } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

export default function SubList({
  sub_todos,
  onSubTodoToggle,
}: {
  sub_todos: {
    id: number;
    sub_task_description: string;
    completed: boolean;
  }[];
  onSubTodoToggle: (
    id: number,
    sub_task_description: string,
    completed: boolean
  ) => Promise<void>;
}) {
  if (!sub_todos?.length) return null;

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
                  onSubTodoToggle(
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
            </div>
          </List.Item>
        )}
      />
    </div>
  );
}
