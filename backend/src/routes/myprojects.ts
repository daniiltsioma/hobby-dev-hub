import { Request, Response, Router } from "express";
import User from "../mongo/models/Users";
import connectToDatabase from "../mongo/dbConnection";

const myProjectRouter = Router();

myProjectRouter.get(
  "/myProjects",
  async (req: Request, res: Response): Promise<void> => {
    try {
      await connectToDatabase();

      const githubId = req.query.githubId as string;

      if (!githubId) {
        res.status(400).send("Github ID is required for this request");
        return;
      }

      const user = await User.findOne({ githubId })
        .populate("activeProjects")
        .populate("archivedProjects");

      if (!user) {
        res.status(400).send("GithubId:" + githubId + " does not exist");
        return;
      } else {
        res.json({
          activeProjects: user.activeProjects,
          archivedProjects: user.archivedProjects,
        });
      }
    } catch (error) {
      console.error("Error fetching projects: ", error);
      res.status(500).send("Internal server error");
      return;
    }
  }
);

export default myProjectRouter;
