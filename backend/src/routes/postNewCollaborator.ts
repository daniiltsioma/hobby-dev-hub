import { Request, Response, Router } from "express";
import connectToDatabase from "../mongo/dbConnection";
import Project from "../mongo/models/Projects";
import projectServices from "../services/projectServices";

const newCollaboratorRouter = Router();
const projectService = new projectServices();

newCollaboratorRouter.post(
  "/newCollaborator",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const title = req.query.title?.toString().trim();
      const projectOwner = req.query.owner?.toString().trim();
      const userToAddAsCollaborator = req.query.userToAddAsCollaborator
        ?.toString()
        .trim();

      if (!title) {
        res.status(400).json({ error: "The title is required" });
        return;
      }

      if (!projectOwner) {
        res.status(400).json({ error: "The owner's username is required" });
        return;
      }

      if (!userToAddAsCollaborator) {
        res
          .status(400)
          .json({ error: "The new collaborator's name is required" });
        return;
      }

      await connectToDatabase();

      const projectExists = await Project.findOne({
        title: title,
        owner: projectOwner,
      });

      if (!projectExists) {
        res.status(404).json({
          error: `Project '${title}' not found for owner '${projectOwner}'`,
        });
        return;
      }

      try {
        const updatedProject = await projectService.addCollaborator(
          projectExists._id.toString(),
          userToAddAsCollaborator
        );

        res.status(200).json({
          success: true,
          message: `Collaborator '${userToAddAsCollaborator}' added successfully to project '${title}'`,
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
