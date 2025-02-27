import { Router, Request, Response } from "express";
import GithubAPI from "../githubAPI";

const githubAPIRouter = Router();

const githubAPI = new GithubAPI();

const getTokenFromHeader = (header: string): string => {
    const headerParts = header.split(" ");
    if (headerParts[0] === "Bearer") {
        return headerParts[1];
    }

    return "";
};

githubAPIRouter.post(
    "/github/repos",
    async (req: Request, res: Response): Promise<void> => {
        if (!req.headers.authorization) {
            res.status(401).send("Not authorized");
            return;
        }

        if (!req.body) {
            res.send(null);
        }

        const authToken = getTokenFromHeader(req.headers.authorization);

        if (!githubAPI.authenticate(authToken)) {
            res.status(401).send("Failed to authenticate");
            return;
        }

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
        if (!req.headers.authorization) {
            res.status(401).send("Not authorized");
            return;
        }

        if (!req.body) {
            res.status(400).send("No issue data provided.");
            return;
        }

        const authToken = getTokenFromHeader(req.headers.authorization);

        if (!githubAPI.authenticate(authToken)) {
            res.status(401).send("Failed to authenticate");
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
