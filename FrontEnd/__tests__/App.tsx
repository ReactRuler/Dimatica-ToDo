import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../src/App";
declare const global: any;

test("renders Logo and MainList components", () => {
  render(<App />);
  const createButton = screen.getByRole("button", { name: /create/i });
  expect(createButton).toBeInTheDocument();
});
