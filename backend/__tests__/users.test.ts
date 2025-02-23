import request from "supertest";
import express from "express";
import userRouter from "../src/routes/users";
import User from "../src/mongo/models/Users";

jest.mock("../src/mongo/dbConnection", () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve()),
}));

jest.mock("../src/mongo/models/Users");

const app = express();
app.use(express.json());
app.use(userRouter);

describe("POST /users", () => {
  it("should create a new user when valid data is provided", async () => {
    const newUser = {
      email: "test@gmail.com",
      githubId: "github123",
      userId: "user123",
      activeProjects: [],
      archivedProjects: [],
    };

    const mockSave = jest.fn().mockResolvedValue(newUser);
    (User.prototype.save as jest.Mock) = mockSave;

    const response = await request(app)
      .post("/users")
      .send(newUser)
      .set("Content-Type", "application/json");

    expect(response.status).toBe(201);
    expect(mockSave).toHaveBeenCalledTimes(1);
  });
});
