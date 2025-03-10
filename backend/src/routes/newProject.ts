import { Request, Response, Router } from "express";
import Project from "../mongo/models/Projects";
import connectToDatabase from "../mongo/dbConnection";
import { Types } from "mongoose";
import User from "../mongo/models/Users";
import projectServices from "../services/projectServices";

const projectRouter = Router();

interface ICreateProjectRequest {
  title: string;
  githubRepoURL: string;
  description?: string;
  technologies?: string[];
  owner: string;
  applicants?: string[];
  collaborators?: string;
  tasks?: string[];
  startDate?: Date;
  endDate?: Date;
  isArchived?: boolean;
}

const projectService = new projectServices();

projectRouter.post(
  "/newProject",
  async (
    req: Request<{}, {}, ICreateProjectRequest>,
    res: Response
  ): Promise<void> => {
    try {
      await connectToDatabase();

      const {
        title,
        githubRepoURL,
        description,
        technologies,
        owner,
        applicants,
        collaborators,
        tasks,
        startDate,
        endDate,
        isArchived,
      } = req.body;

      if (!title || !githubRepoURL || !owner) {
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

      const newProject = await projectService.createProject({
        title,
        githubRepoURL,
        description,
        technologies,
        owner,
        applicants,
        collaborators,
        tasks,
        startDate,
        endDate,
        isArchived,
      });

      if (!newProject) {
        res
          .status(500)
          .send(
            "An internal server error occurred, the new project could not be saved"
          );
        return;
      }

      res.status(201).json(newProject);
      return;
    } catch (error) {
      console.error("Error creating project: ", error);
      res.status(500).send("Internal server error");
    }
  }
);

export default projectRouter;
