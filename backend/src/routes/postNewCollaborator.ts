import { Request, Response, Router } from "express";
import connectToDatabase from "../mongo/dbConnection";
import Project from "../mongo/models/Projects";
import projectServices from "../services/projectServices";
import { isValidObjectId } from "mongoose";

const newCollaboratorRouter = Router();
const projectService = new projectServices();

newCollaboratorRouter.post(
  "/projects/:projectId/:userToAdd/newCollaborator",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { projectId, userToAddAsCollaborator: userToAdd } = req.body;

      if (!userToAdd) {
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
          userToAdd
        );

        res.status(200).json({
          success: true,
          message: `Collaborator '${userToAdd}' added successfully to project`,
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
