import { Request, Response, Router } from "express";
import connectToDatabase from "../mongo/dbConnection";
import projectServices from "../services/projectServices";

const ownerProjectRouter = Router();
const projectService = new projectServices();

ownerProjectRouter.get(
  "/getProjectsForOwner",
  async (req: Request, res: Response): Promise<void> => {
    try {
      await connectToDatabase();

      const githubId = req.query.githubId as string;

      if (!githubId) {
        res.status(400).send("Github ID is required for this request");
        return;
      }

      const projects = await projectService.returnAllProjectsForAnOwner(
        githubId
      );

      if (!projects || projects.length === 0) {
        res.status(404).send("No projects found for user '" + githubId + "'");
        return;
      }

      res.json({ projects });
    } catch (error) {
      console.error("Error fetching projects: ", error);
      res.status(500).send("Internal server error");
      return;
    }
  }
);

export default ownerProjectRouter;
