import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SubList from "../src/components/ListComponents/SubList";
declare const global: any;
const mockSubTodos = [
  {
    id: 1,
    sub_task_description: "Sub task 1",
    completed: false,
  },
];

const mockOnSubTodoUpdate = jest.fn();
const mockOnDeleteSubTodo = jest.fn();

test("renders sub todos and handles switch toggle", () => {
  render(
    <SubList
      sub_todos={mockSubTodos}
      onSubTodoUpdate={mockOnSubTodoUpdate}
      onDeleteSubTodo={mockOnDeleteSubTodo}
    />
  );
  expect(screen.getByText("Sub task 1")).toBeInTheDocument();
  const switchElement = screen.getByRole("switch");
  fireEvent.click(switchElement);
  expect(mockOnSubTodoUpdate).toHaveBeenCalledWith(1, "Sub task 1", true);
});

test("delete button calls onDeleteSubTodo", () => {
  render(
    <SubList
      sub_todos={mockSubTodos}
      onSubTodoUpdate={mockOnSubTodoUpdate}
      onDeleteSubTodo={mockOnDeleteSubTodo}
    />
  );
  const deleteButton = screen.getByRole("button", { name: /delete/i });
  fireEvent.click(deleteButton);
  expect(mockOnDeleteSubTodo).toHaveBeenCalledWith(1);
});
