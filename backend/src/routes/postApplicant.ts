import { Request, Response, Router } from "express";
import projectServices from "../services/projectServices";
import connectToDatabase from "../mongo/dbConnection";
import { isValidObjectId } from "mongoose";
import Project from "../mongo/models/Projects";

const newApplicantRouter = Router();
const projectService = new projectServices();

newApplicantRouter.post(
  "/projects/:projectId/applicants",
  async (req: Request, res: Response): Promise<void> => {
    try {
      await connectToDatabase();

      const { projectId } = req.params;
      const { userToApply } = req.body;

      if (!projectId || !isValidObjectId(projectId)) {
        res.status(400).json({ error: "Invalid projectId" });
        return;
      }

      if (!userToApply) {
        res.status(400).json({ error: "Username is required" });
        return;
      }

      const project = await Project.findById(projectId);
      if (!project) {
        throw new Error("Project not found.");
      }

      try {
        const updatedProject = await projectService.addApplicant(
          project,
          userToApply
        );

        res.status(200).json({
          success: true,
          message: `Applicant '${userToApply}' added to the project successfully!`,
          project: updatedProject,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        res.status(400).json({ error: errorMessage });
        return;
      }
    } catch (error) {
      console.error("Error adding a collaborator: ", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default newApplicantRouter;
