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

        res.send(repoData);
    }
);

export default githubAPIRouter;
