import { Request, Response, Router } from "express";
import connectToDatabase from "../mongo/dbConnection";
import Project from "../mongo/models/Projects";
import projectServices from "../services/projectServices";
import { isValidObjectId } from "mongoose";
import GithubAPI from "../githubAPI";

const newCollaboratorRouter = Router();
const projectService = new projectServices();

const githubAPI = new GithubAPI();

newCollaboratorRouter.post(
    "/projects/:projectId/:userToAdd/newCollaborator",
    async (req: Request, res: Response): Promise<void> => {
        try {
            const { projectId, userToAdd } = req.params;

            if (!userToAdd) {
                res.status(400).json({
                    error: "The new collaborator's name is required",
                });
                return;
            }

            if (!isValidObjectId(projectId)) {
                res.status(400).json({
                    error: "Invalid formatting for projectId",
                });
                return;
            }

            const project = await Project.findById(projectId);

            if (!project) {
                res.status(404).json({ error: "Project not found" });
                return;
            }

            let updatedProject;

            try {
                updatedProject = await projectService.addCollaborator(
                    project,
                    userToAdd
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
                    await githubAPI.inviteCollaborator(
                        githubRepoName,
                        userToAdd
                    );
                } catch {
                    res.status(400).send({
                        error: "Error adding a collaborator",
                    });
                    return;
                }

                try {
                    updatedProject = await projectService.removeApplicant(
                        updatedProject.id,
                        userToAdd
                    );
                } catch {
                    res.status(400).send({
                        error: "Error removing an applicant",
                    });
                }

                res.status(200).json({
                    success: true,
                    message: `Collaborator '${userToAdd}' added successfully to project`,
                    project: updatedProject,
                });
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Unknown error occurred";
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
