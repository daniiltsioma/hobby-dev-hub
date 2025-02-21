import { Request, Response, Router } from "express";
import Project from "../mongo/models/Projects";
import connectToDatabase from "../mongo/dbConnection";

const projectRouter = Router();

projectRouter.post(
  "/api/projects",
  async (req: Request, res: Response): Promise<void> => {
    try {
      await connectToDatabase();

      const { name, repoURL, description, sprintStatus, startDate, endDate } =
        req.body;

      if (!name || !repoURL) {
        res.status(400).send("Project name and repoURL are required.");
        return;
      }

      const newProject = new Project({
        name,
        repoURL,
        description,
        sprintStatus,
        startDate,
        endDate,
        approvedUsers: [],
        applicants: [],
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
