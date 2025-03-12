import { Request, Response, Router } from "express";
import connectToDatabase from "../mongo/dbConnection";
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
  "/projects/newProject",
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
        res
          .status(400)
          .json({ error: "Project name, repoURL, and owner are required." });
        return;
      }

      const existingUser = await User.findOne({ githubID: owner });
      if (!existingUser) {
        res.status(404).json({ error: "Owner not found." });
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
        res.status(500).json({
          error:
            "An internal server error occurred, the new project could not be saved",
        });
        return;
      }

      res.status(201).json({
        success: true,
        message: "Project created successfully",
        project: newProject,
      });
    } catch (error) {
      console.error("Error creating project: ", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default projectRouter;
