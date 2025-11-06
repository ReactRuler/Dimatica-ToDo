process.env.NODE_ENV = "test";

import request from "supertest";
import { Pool } from "pg";
import app from "../server";

// Mock pg module
jest.mock("pg", () => {
  const mPool = {
    query: jest.fn(),
    connect: jest.fn(),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

// Get the mocked pool instance
let mockPool: jest.Mocked<Pool>;

describe("Todo API Tests", () => {
  beforeAll(() => {
    mockPool = require("pg").Pool() as jest.Mocked<Pool>;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /todos", () => {
    it("should return all todos with sub_todos", async () => {
      const mockData = [
        {
          id: 1,
          title: "Test Todo",
          description: "Test Description",
          completed: false,
          created_at: "2025-01-01",
          updated_at: "2025-01-01",
          sub_todos: [
            {
              id: 1,
              sub_task_description: "Sub task 1",
              completed: false,
              created_at: "2025-01-01",
              updated_at: "2025-01-01",
            },
          ],
        },
      ];

      (mockPool.query as jest.Mock).mockResolvedValueOnce({ rows: mockData });

      const response = await request(app).get("/todos");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);
      expect(mockPool.query).toHaveBeenCalledTimes(1);
    });

    it("should return 500 on database error", async () => {
      (mockPool.query as jest.Mock).mockRejectedValueOnce(
        new Error("DB Error")
      );

      const response = await request(app).get("/todos");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Internal Server Error" });
    });
  });

  describe("POST /todos", () => {
    it("should create a new todo", async () => {
      const newTodo = {
        title: "New Todo",
        description: "New Description",
        completed: false,
      };

      const mockResult = {
        id: 1,
        ...newTodo,
        created_at: "2025-01-01",
        updated_at: "2025-01-01",
      };
      (mockPool.query as jest.Mock).mockResolvedValueOnce({
        rows: [mockResult],
      });

      const response = await request(app).post("/todos").send(newTodo);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockResult);
    });

    it("should return 500 on database error", async () => {
      (mockPool.query as jest.Mock).mockRejectedValueOnce(
        new Error("DB Error")
      );

      const response = await request(app)
        .post("/todos")
        .send({ title: "Test" });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Internal Server Error" });
    });
  });

  describe("POST /sub_todos", () => {
    it("should create a new sub_todo", async () => {
      const newSubTodo = {
        todo_id: 1,
        sub_task_description: "New Sub Task",
        completed: false,
      };

      const mockResult = {
        id: 1,
        ...newSubTodo,
        created_at: "2025-01-01",
        updated_at: "2025-01-01",
      };
      (mockPool.query as jest.Mock).mockResolvedValueOnce({
        rows: [mockResult],
      });

      const response = await request(app).post("/sub_todos").send(newSubTodo);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockResult);
    });
  });

  describe("DELETE /todos/:id", () => {
    it("should delete a todo", async () => {
      (mockPool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const response = await request(app).delete("/todos/1");

      expect(response.status).toBe(204);
      expect(mockPool.query).toHaveBeenCalledWith(
        "DELETE FROM todos WHERE id = $1",
        ["1"]
      );
    });

    it("should return 500 on database error", async () => {
      (mockPool.query as jest.Mock).mockRejectedValueOnce(
        new Error("DB Error")
      );

      const response = await request(app).delete("/todos/1");

      expect(response.status).toBe(500);
    });
  });

  describe("DELETE /sub_todos/:id", () => {
    it("should delete a sub_todo", async () => {
      (mockPool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const response = await request(app).delete("/sub_todos/1");

      expect(response.status).toBe(204);
      expect(mockPool.query).toHaveBeenCalledWith(
        "DELETE FROM sub_todos WHERE id = $1",
        ["1"]
      );
    });
  });

  describe("PUT /todos/:id", () => {
    it("should update a todo", async () => {
      const updateData = {
        title: "Updated Title",
        description: "Updated Description",
        completed: true,
      };

      (mockPool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const response = await request(app).put("/todos/1").send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Todo updated successfully" });
    });
  });

  describe("PUT /sub_todos/:id", () => {
    it("should update a sub_todo", async () => {
      const updateData = {
        sub_task_desciption: "Updated Sub Task",
        completed: true,
      };

      (mockPool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const response = await request(app).put("/sub_todos/1").send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: "SubTodo updated successfully",
      });
    });
  });
});
