/*import request from "supertest";
import express from "express";
import router from "../src/routes/users"; // Adjust path as needed

// Mock the User model correctly
jest.mock("../src/mongo/models/Users", () => {
  return jest.fn().mockImplementation(() => ({
    save: jest.fn().mockResolvedValue({
      _id: "123",
      email: "test@example.com",
      githubId: "12345",
      userId: "user123",
      activeProjects: [],
      archivedProjects: [],
    }),
  }));
});

describe("POST /api/users", () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(router); // Use the route in the app
  });

  afterAll(() => {
    jest.resetAllMocks(); // Reset mocks after tests
  });

  it("should create a new user and return 201 status", async () => {
    const newUser = {
      email: "test@example.com",
      githubId: "12345",
      userId: "user123",
    };

    const response = await request(app).post("/api/users").send(newUser);

    // Check that the response status is 201 (Created)
    expect(response.status).toBe(201);

    // Check that the response body contains the new user data
    expect(response.body).toEqual({
      _id: "123",
      email: "test@example.com",
      githubId: "12345",
      userId: "user123",
      activeProjects: [],
      archivedProjects: [],
    });

    // Ensure the save method was called once
    const User = require("../src/mongo/models/Users"); // Re-import here
    const userInstance = new User(); // Create an instance of the mocked User
    expect(userInstance.save).toHaveBeenCalledTimes(1);
  });
});*/
/*import request from "supertest";
import express from "express";
import router from "../src/routes/users"; // Adjust path as needed

// Mock the User model correctly
jest.mock("../src/mongo/models/Users", () => {
  return jest.fn().mockImplementation(function (this: any) {
    this.save = jest.fn().mockResolvedValue({
      _id: "123",
      email: "test@example.com",
      githubId: "12345",
      userId: "user123",
      activeProjects: [],
      archivedProjects: [],
    });
  });
});

describe("POST /api/users", () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(router); // Use the route in the app
  });

  afterAll(() => {
    jest.resetAllMocks(); // Reset mocks after tests
  });

  it("should create a new user and return 201 status", async () => {
    const newUser = {
      email: "test@example.com",
      githubId: "12345",
      userId: "user123",
    };

    const response = await request(app).post("/api/users").send(newUser);

    // Check that the response status is 201 (Created)
    expect(response.status).toBe(201);

    // Check that the response body contains the new user data
    expect(response.body).toEqual({
      _id: "123",
      email: "test@example.com",
      githubId: "12345",
      userId: "user123",
      activeProjects: [],
      archivedProjects: [],
    });

    // Ensure the save method was called once
    const User = require("../src/mongo/models/Users"); // Re-import here
    const userInstance = new User(); // Create an instance of the mocked User
    expect(userInstance.save).toHaveBeenCalledTimes(1);
  });
});*/

/*import request from "supertest";
import express from "express";
import router from "../src/routes/users"; // Adjust path as needed

// Mock the User model correctly
jest.mock("../src/mongo/models/Users", () => {
  return jest.fn().mockImplementation(function (this: any) {
    this.save = jest.fn().mockResolvedValue({
      _id: "123",
      email: "test@example.com",
      githubId: "12345",
      userId: "user123",
      activeProjects: [],
      archivedProjects: [],
    });
  });
});

describe("POST /api/users", () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(router); // Use the route in the app
  });

  afterAll(() => {
    jest.resetAllMocks(); // Reset mocks after tests
  });

  it("should create a new user and return 201 status", async () => {
    const newUser = {
      email: "test@example.com",
      githubId: "12345",
      userId: "user123",
    };

    const response = await request(app).post("/api/users").send(newUser);

    // Check that the response status is 201 (Created)
    expect(response.status).toBe(201);

    // Check that the response body contains the new user data
    expect(response.body).toEqual({
      _id: "123",
      email: "test@example.com",
      githubId: "12345",
      userId: "user123",
      activeProjects: [],
      archivedProjects: [],
    });

    // Ensure the save method was called once
    const User = require("../src/mongo/models/Users"); // Re-import here
    const userInstance = new User(); // Create an instance of the mocked User
    expect(userInstance.save).toHaveBeenCalledTimes(1);
  });
});*/

import request from "supertest";
import express from "express";
import userRouter from "../src/routes/users"; // Adjust path as needed

// Mock the User model correctly
jest.mock("../src/mongo/models/Users", () => {
  const mockSave = jest.fn().mockResolvedValue({
    _id: "123",
    email: "test@example.com",
    githubId: "12345",
    userId: "user123",
    activeProjects: [],
    archivedProjects: [],
  });

  return {
    // Mocking the constructor
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      save: mockSave,
    })),
  };
});

describe("POST /api/users", () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(userRouter); // Use the route in the app
  });

  afterAll(() => {
    jest.resetAllMocks(); // Reset mocks after tests
  });

  it("should create a new user and return 201 status", async () => {
    const newUser = {
      email: "test@example.com",
      githubId: "12345",
      userId: "user123",
    };

    const response = await request(app).post("/api/users").send(newUser);

    // Check that the response status is 201 (Created)
    expect(response.status).toBe(201);

    // Check that the response body contains the new user data
    expect(response.body).toEqual({
      _id: "123",
      email: "test@example.com",
      githubId: "12345",
      userId: "user123",
      activeProjects: [],
      archivedProjects: [],
    });

    // Ensure the save method was called once
    const User = require("../src/mongo/models/Users"); // Re-import here
    const userInstance = new User(); // Create an instance of the mocked User
    expect(userInstance.save).toHaveBeenCalledTimes(1);
  });
});
