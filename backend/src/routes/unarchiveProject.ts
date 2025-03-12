import connectToDatabase from "../mongo/dbConnection";
import { Request, Response, Router } from "express";
import projectServices from "../services/projectServices";
import { isValidObjectId } from "mongoose";

const unarchiveProjectRouter = Router();
const projectService = new projectServices();

unarchiveProjectRouter.post(
  "/projects/:projectId/unarchive",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { projectId } = req.params;

      if (!projectId || !isValidObjectId(projectId)) {
        res.status(400).json({ error: "Project ID is invalid" });
        return;
      }

      try {
        const updatedProj = await projectService.unarchiveProject(projectId);

        res.status(200).json({
          success: true,
          message: `Project '${updatedProj.title}' has status changed from 'archived' to 'active' successfully!`,
          title: updatedProj,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        res.status(400).json({ error: errorMessage });
        return;
      }
    } catch (error) {
      console.error("Error: could not unarchive project: ", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default unarchiveProjectRouter;
