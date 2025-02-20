import { Request, Response, Router } from "express";
import User from "../mongo/models/Users";
import connectToDatabase from "../mongo/dbConnection";

const router = Router();

router.get(
  "/myprojects",
  async (req: Request, res: Response): Promise<void> => {
    try {
      await connectToDatabase();

      const userId = req.query.userId as string;
      const githubId = req.query.githubId as string;

      if (!userId) {
        res.status(400).send("User ID is required for this request");
        return;
      }

      if (!githubId) {
        res.status(400).send("Github ID is required for this request");
        return;
      }

      const user = await User.findOne({ userId, githubId })
        .populate("activeProjects")
        .populate("archivedProjects");

      if (!user) {
        res
          .status(400)
          .send(
            "User userId:" +
              userId +
              " githubId:" +
              githubId +
              " does not exist"
          );
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

export default router;
