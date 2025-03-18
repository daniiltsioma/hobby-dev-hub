import { Request, Response, Router } from "express";
import projectServices from "../services/projectServices";
import GithubAPI from "../githubAPI";

const removeCollaboratorRouter = Router();
const projectService = new projectServices();

const githubAPI = new GithubAPI();

removeCollaboratorRouter.delete(
    "/removeCollaborator/:projectId/:userToRemove",
    async (req: Request, res: Response): Promise<void> => {
        try {
            const { projectId, userToRemove } = req.params;

            if (!projectId || !userToRemove) {
                res.status(400).json({
                    error: "Project ID and userToRemove are required.",
                });
                return;
            }

            let updatedProject;

            try {
                updatedProject = await projectService.removeCollaborator(
                    projectId,
                    userToRemove
                );

                if (!req.headers.authorization) {
                    res.status(401).send({
                        error: "Not authorized to access these resources.",
                    });
                    return;
                }
                githubAPI.authenticate(req.headers.authorization);

                const githubRepoName = updatedProject.githubRepoURL
                    .split("/")
                    .at(-1);

                try {
                    await githubAPI.removeCollaborator(
                        githubRepoName || "",
                        userToRemove
                    );
                } catch {
                    res.status(400).send({
                        error: "Error removing a collaborator",
                    });
                    return;
                }

                res.status(200).json({
                    success: true,
                    message: `User '${userToRemove}' removed from Collaborators successfully.`,
                    project: updatedProject,
                });
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Unknown error occurred";
                res.status(400).json({ error: errorMessage });
            }
        } catch (error) {
            console.error("Error removing collaborator:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);

export default removeCollaboratorRouter;
