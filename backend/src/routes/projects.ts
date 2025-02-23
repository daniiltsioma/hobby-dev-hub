import { Request, Response, Router } from "express";
import Project from "../mongo/models/Projects";
import connectToDatabase from "../mongo/dbConnection";
import { Types } from "mongoose";
import User from "../mongo/models/Users";

const projectRouter = Router();

interface ICreateProjectRequest {
  name: string;
  repoURL: string;
  description?: string;
  tags: string[];
  owner: Types.ObjectId;
  sprintStatus?: string;
  tasks?: string[];
  startDate?: Date;
  endDate?: Date;
}

projectRouter.post(
  "/projects",
  async (
    req: Request<{}, {}, ICreateProjectRequest>,
    res: Response
  ): Promise<void> => {
    try {
      await connectToDatabase();

      const {
        name,
        repoURL,
        description,
        tags,
        owner,
        sprintStatus,
        tasks,
        startDate,
        endDate,
      } = req.body;

      if (!name || !repoURL || !owner) {
        res.status(400).send("Project name, repoURL, and owner are required.");
        return;
      }

      if (!Types.ObjectId.isValid(owner)) {
        res.status(400).send("Invalid owner ID format.");
        return;
      }

      const existingUser = await User.findById(owner);
      if (!existingUser) {
        res.status(404).send("Owner not found.");
        return;
      }

      const newProject = new Project({
        name,
        repoURL,
        description,
        tags,
        owner,
        sprintStatus: sprintStatus || "Active",
        approvedUsers: [],
        applicants: [],
        tasks: tasks || [],
        startDate: startDate || Date.now,
        endDate,
      });

      await newProject.save();
      console.log("Project ");

      res.status(201).json(newProject);
      return;
    } catch (error) {
      console.error("Error creating project: ", error);
      res.status(500).send("Internal server error");
    }
  }
);

export default projectRouter;
