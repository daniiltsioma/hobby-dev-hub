import request from "supertest";
import express from "express";
import applyingRouter from "../src/routes/apply";
import Project from "../src/mongo/models/Projects";

jest.mock("../src/mongo/dbConnection", () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve()),
}));

const app = express();
app.use(express.json());
app.use(applyingRouter);

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
    applicants: ["60a7654b6f1f1e3a7c8f7b5a"],
    tasks: ["Task 1", "Task 2"],
    startDate: new Date("2025-01-01"),
    endDate: new Date("2025-12-31"),
    save: jest.fn(),
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
    applicants: ["60a7654b6f1f1e3a7c8f7b5a"],
    tasks: ["Task 3"],
    startDate: new Date("2025-02-01"),
    endDate: new Date("2025-10-01"),
    save: jest.fn(),
  },
];

describe("POST /project/apply/:id", () => {
  it ("should successfully apply for a project", async () => {
    Project.findById = jest.fn().mockResolvedValue(mockProjects[0]);

    const response = await request(app)
      .post("/project/apply/projectId1")
      .send({applicantId: "60a7654b6f1f1e3a7c8f7b61"})
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Application submitted successfully!");
    expect(mockProjects[0].applicants.map(String)).toContain("60a7654b6f1f1e3a7c8f7b61");
    expect(mockProjects[0].save).toHaveBeenCalled();
  });

  it("should return an error if project not found", async () => {
    Project.findById = jest.fn().mockResolvedValue(null);

    const response = await request(app)
      .post("/project/apply/project1000")
      .send({ applicantId: "60a7654b6f1f1e3a7c8f7b66" })
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
    expect(response.body).toEqual("Project not found.");
  });

  it("should return an error if user has already applied", async () => {
    Project.findById = jest.fn().mockResolvedValue(mockProjects[1]);

    const response = await request(app)
      .post("/project/apply/projectId2")
      .send({ applicantId: "60a7654b6f1f1e3a7c8f7b5a" })
      .set("Accept", "application/json");

    expect(response.status).toBe(401);
    expect(response.body).toBe("User has already applied.");
  });

  it("should return an error if invalid project or applicant ID", async () => {
    const response = await request(app)
      .post("/project/apply/null")
      .send({ applicantId: "invalidId" })
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.body).toBe("Invalid project ID or applicant ID.");
  });
});