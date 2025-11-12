import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import MainList from "../src/components/ListComponents/List";
declare const global: any;

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve([
          {
            id: 1,
            title: "Test Todo",
            description: "Test Description",
            completed: false,
            sub_todos: [],
          },
        ]),
      ok: true,
    })
  ) as jest.Mock;
});

afterEach(() => {
  jest.resetAllMocks();
});

test("loads and displays todos", async () => {
  render(<MainList />);
  await waitFor(() => {
    expect(screen.getByText("Test Todo")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });
});

test("toggle todo completion calls updateTodo", async () => {
  render(<MainList />);
  await waitFor(() => screen.getByText("Test Todo"));
  const switchElement = screen.getByRole("switch");
  fireEvent.click(switchElement);
});
