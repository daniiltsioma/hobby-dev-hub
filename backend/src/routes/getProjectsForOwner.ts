import { Request, Response, Router } from "express";
import connectToDatabase from "../mongo/dbConnection";
import projectServices from "../services/projectServices";

const ownerProjectRouter = Router();
const projectService = new projectServices();

ownerProjectRouter.get(
  "/project/:githubId/forOwner",
  async (req: Request, res: Response): Promise<void> => {
    try {
      await connectToDatabase();
      const { githubId } = req.params;

      if (!githubId) {
        res
          .status(400)
          .json({ error: "Github ID is required for this request" });
        return;
      }

      const projects = await projectService.returnAllProjectsForAnOwner(
        githubId
      );

      if (!projects || projects.length === 0) {
        res
          .status(404)
          .json({ error: `No projects found for user '${githubId}'` });
        return;
      }

      res.json({
        success: true,
        message: "Project(s) found!",
        projects: projects,
      });
    } catch (error) {
      console.error("Error fetching projects: ", error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
  }
);

export default ownerProjectRouter;
