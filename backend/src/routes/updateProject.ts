import { Request, Response, Router } from "express";
import projectServices from "../services/projectServices";
import connectToDatabase from "../mongo/dbConnection";

const updateProjectRouter = Router();
const projectService = new projectServices();

updateProjectRouter.put(
  "/projects/:projectId/update",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { projectId } = req.params;
      const updateData = req.body;

      if (!projectId) {
        res.status(400).json({ error: "Project ID is required" });
        return;
      }

      if (!updateData || Object.keys(updateData).length === 0) {
        res.status(400).json({ error: "No update data provided" });
        return;
      }

      try {
        const updatedProject = await projectService.updateProject(
          projectId,
          updateData
        );

        res.status(200).json({
          success: true,
          message: `Project '${updatedProject.title}' updated successfully!`,
          project: updatedProject,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        res.status(400).json({ error: errorMessage });
      }
    } catch (error) {
      console.error("Error searching projects:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default updateProjectRouter;
