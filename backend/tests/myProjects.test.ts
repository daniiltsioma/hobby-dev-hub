import request from "supertest";
import express from "express";
import router from "../src/routes/myProjects"; // Import your routes
import User from "../src/mongo/models/Users";

jest.mock("../src/mongo/dbConnection", () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve()), // Mock the database connection
}));

const app = express();
app.use(express.json());
app.use("/api", router);

const mockProjects = [
  {
    _id: "projectId1",
    name: "Project 1",
    repoUrl: "www.test.com",
    description: "Description of project 1",
    sprintStatus: "Active",
    approvedUsers: [],
    applicants: [],
    startDate: Date.now(),
  },
  {
    _id: "projectId2",
    name: "Project 2",
    repoUrl: "www.test2.com",
    description: "Description of project 2",
    sprintStatus: "Active",
    approvedUsers: [],
    applicants: [],
    startDate: Date.now(),
  },
];

describe("GET /api/myProjects", () => {
  it("should return user projects when valid userId and githubId are provided", async () => {
    const mockUser = {
      email: "test@gmail.com",
      githubId: "github1",
      userId: "user1",
      activeProjects: mockProjects.slice(0, 1),
      archivedProjects: mockProjects.slice(1),
      populate: jest.fn().mockImplementation(function (this: any) {
        return Promise.resolve(this);
      }),
    };

    (User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);

    const response = await request(app).get(
      "/api/myProjects?userId=user1&githubId=github1"
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      activeProjects: mockUser.activeProjects,
      archivedProjects: mockUser.archivedProjects,
    });

    expect(mockUser.populate).toHaveBeenCalledWith("activeProjects");
    expect(mockUser.populate).toHaveBeenCalledWith("archivedProjects");
  });
});
