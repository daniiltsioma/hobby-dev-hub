import { Request, Response, Router } from "express";
import projectServices from "../services/projectServices";
import connectToDatabase from "../mongo/dbConnection";

const deleteProjectRouter = Router();
const projectService = new projectServices();

deleteProjectRouter.delete(
  "/projects/:projectId/delete",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { projectId } = req.params;

      if (!projectId) {
        res.status(400).json({ error: "Project ID is required." });
        return;
      }

      try {
        const result = await projectService.deleteProject(projectId);
        res.status(200).json(result);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred.";
        res.status(404).json({ error: errorMessage });
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default deleteProjectRouter;
