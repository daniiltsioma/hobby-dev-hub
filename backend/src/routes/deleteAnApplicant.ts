import { Request, Response, Router } from "express";
import projectServices from "../services/projectServices";
import { isValidObjectId } from "mongoose";
import connectToDatabase from "../mongo/dbConnection";

const removeApplicantRouter = Router();
const projectService = new projectServices();

removeApplicantRouter.delete(
  "/projects/:projectId/applicants/:userToRemove",
  async (req: Request, res: Response): Promise<void> => {
    try {
      await connectToDatabase();

      const { projectId, userToRemove } = req.params;

      if (!projectId || !userToRemove) {
        res
          .status(400)
          .json({ error: "Project ID and userToRemove are required." });
        return;
      }

      try {
        const updatedProject = await projectService.removeApplicant(
          projectId,
          userToRemove
        );

        res.status(200).json({
          success: true,
          message: `User '${userToRemove}' removed from applicants successfully.`,
          projectId: updatedProject._id,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        res.status(400).json({ error: errorMessage });
      }
    } catch (error) {
      console.error("Error removing collaborator:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);
