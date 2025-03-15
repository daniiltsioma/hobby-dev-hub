import { Request, Response, Router } from "express";
import connectToDatabase from "../mongo/dbConnection";
import User from "../mongo/models/Users";
import projectServices from "../services/projectServices";
import GithubAPI from "../githubAPI";

const projectRouter = Router();

interface ICreateProjectRequest {
    title: string;
    githubRepoURL: string;
    description?: string;
    technologies?: string[];
    owner: string;
    applicants?: string[];
    collaborators?: string;
    tasks?: string[];
    startDate?: Date;
    endDate?: Date;
    isArchived?: boolean;
}

const projectService = new projectServices();
const githubAPI = new GithubAPI();

projectRouter.post(
    "/projects/newProject",
    async (
        req: Request<{}, {}, ICreateProjectRequest>,
        res: Response
    ): Promise<void> => {
        try {
            await connectToDatabase();

            const {
                title,
                description,
                technologies,
                applicants,
                collaborators,
                startDate,
                endDate,
                isArchived,
            } = req.body as ICreateProjectRequest;

            if (!title) {
                res.status(400).json({
                    error: "Project title is required.",
                });
                return;
            }

            /*const existingUser = await User.findOne({ githubID: owner });
      if (!existingUser) {
        res.status(404).json({ error: "Owner not found." });
        return;
      }*/

            if (!req.headers.authorization) {
                res.status(401).send({
                    error: "Not authorized to access these resources.",
                });
                return;
            }
            githubAPI.authenticate(req.headers.authorization);
            const user = await githubAPI.getUser();
            if (!user) {
                res.status(401).send({
                    error: "Not authorized to access these resources.",
                });
                return;
            }

            let githubResponse;

            try {
                githubResponse = await githubAPI.createRepo({
                    name: title,
                    makePrivate: false,
                    description,
                });
            } catch {
                res.status(400).send({
                    error: "Error creating the repository.",
                });
                return;
            }

            const owner = user.login;

            const newProject = await projectService.createProject({
                title,
                githubRepoURL: githubResponse.html_url,
                description,
                technologies,
                owner,
                applicants,
                collaborators,
                startDate,
                endDate,
                isArchived,
            });

            if (!newProject) {
                res.status(500).json({
                    error: "An internal server error occurred, the new project could not be saved",
                });
                return;
            }

            res.status(201).json({
                success: true,
                message: "Project created successfully",
                project: newProject,
            });
        } catch (error) {
            console.error("Error creating project: ", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);

export default projectRouter;
