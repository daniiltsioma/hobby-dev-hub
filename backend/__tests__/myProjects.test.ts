import request from "supertest";
import express from "express";
import myProjectRouter from "../src/routes/myProjects";
import User from "../src/mongo/models/Users";

jest.mock("../src/mongo/dbConnection", () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve()),
}));

jest.mock("../src/mongo/models/Users");
jest.mock("../src/mongo/models/Projects");

const app = express();
app.use(express.json());
app.use(myProjectRouter);

const mockProjects = [
  {
    _id: "projectId1",
    name: "Project 1",
    repoURL: "www.test.com",
    description: "Description of project 1",
    tags: ["React", "Node.js"],
    owner: "user1",
    sprintStatus: "Active",
    approvedUsers: ["approvedUserId1", "approvedUserId2"],
    applicants: ["applicantId1"],
    tasks: ["Task 1", "Task 2"],
    startDate: new Date("2025-01-01"),
    endDate: new Date("2025-12-31"),
  },
  {
    _id: "projectId2",
    name: "Project 2",
    repoURL: "www.test2.com",
    description: "Description of project 2",
    tags: ["MongoDB", "Python"],
    owner: "user2",
    sprintStatus: "Completed",
    approvedUsers: ["approvedUserId3"],
    applicants: ["applicantId2"],
    tasks: ["Task 3"],
    startDate: new Date("2025-02-01"),
    endDate: new Date("2025-10-01"),
  },
];

describe("GET /myProjects", () => {
  it("should return user projects when valid userId and githubId are provided", async () => {
    const mockUser = {
      email: "test@gmail.com",
      githubId: "github1",
      userId: "user1",
      _id: "user1",
      activeProjects: mockProjects.slice(0, 1),
      archivedProjects: mockProjects.slice(1),
    };

    const mockFindOne = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValueOnce(mockUser),
    });

    jest.spyOn(User, "findOne").mockImplementation(mockFindOne);

    const response = await request(app).get(
      "/myProjects?userId=user1&githubId=github1"
    );

    expect(response.status).toBe(200);
  });
});
