import { Request, Response, Router } from "express";
import connectToDatabase from "../mongo/dbConnection";
import Project from "../mongo/models/Projects";
import projectServices from "../services/projectServices";
import { isValidObjectId } from "mongoose";

const newCollaboratorRouter = Router();
const projectService = new projectServices();

newCollaboratorRouter.post(
  "/newCollaborator",
  async (req: Request, res: Response): Promise<void> => {
    try {
      await connectToDatabase();

      const { projectId, userToAddAsCollaborator } = req.body;

      if (!userToAddAsCollaborator) {
        res
          .status(400)
          .json({ error: "The new collaborator's name is required" });
        return;
      }

      if (!isValidObjectId(projectId)) {
        res.status(400).json({ error: "Invalid formatting for projectId" });
        return;
      }

      const project = await Project.findById({ projectId });

      if (!project) {
        res.status(404).json({ error: "Project not found" });
        return;
      }

      try {
        const updatedProject = await projectService.addCollaborator(
          project,
          userToAddAsCollaborator
        );

        res.status(200).json({
          success: true,
          message: `Collaborator '${userToAddAsCollaborator}' added successfully to project`,
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

export default newCollaboratorRouter;
