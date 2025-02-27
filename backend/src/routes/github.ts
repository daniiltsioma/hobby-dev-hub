import { Router, Request, Response } from "express";
import GithubAPI from "../githubAPI";

const githubAPIRouter = Router();

const githubAPI = new GithubAPI();

githubAPIRouter.post(
    "/github/repos",
    async (req: Request, res: Response): Promise<void> => {
        if (!req.body) {
            res.send(null);
        }

        githubAPI.authenticate(req.headers.authorization || "");

        const repoData = await githubAPI.createRepo({
            name: req.body.name,
            makePrivate: req.body.makePrivate || false,
            description: req.body.description,
        });

        githubAPI.logout();

        res.send(repoData);
    }
);

githubAPIRouter.post(
    "/github/repos/:repoName/issues",
    async (req: Request, res: Response): Promise<void> => {
        if (!req.body) {
            res.status(400).send("No issue data provided.");
        }
        githubAPI.authenticate(req.headers.authorization || "");

        const username = (await githubAPI.getUser())?.login;

        if (!username) {
            res.status(401).send("Not authenticated");
        }

        try {
            const issueData = await githubAPI.createIssue({
                repoName: req.params.repoName || "",
                title: req.body.title,
                body: req.body.description,
            });
            res.status(201).json(issueData);
        } catch (err) {
            res.status(400).send(err);
        }
    }
);

export default githubAPIRouter;
