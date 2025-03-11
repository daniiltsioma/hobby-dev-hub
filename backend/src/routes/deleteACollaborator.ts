import { Request, Response, Router } from "express";
import projectServices from "../services/projectServices";

const removeCollaboratorRouter = Router();
const projectService = new projectServices();

removeCollaboratorRouter.delete(
  "/removeCollaborator/:projectId/:userToRemove",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { projectId, userToRemove } = req.params;

      if (!projectId || !userToRemove) {
        res
          .status(400)
          .json({ error: "Project ID and userToRemove are required." });
        return;
      }

      try {
        const result = await projectService.removeCollaborator(
          projectId,
          userToRemove
        );

        res.status(200).json(result);
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

export default removeCollaboratorRouter;
