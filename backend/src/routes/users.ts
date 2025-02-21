import { Request, Response, Router } from "express";
import User from "../mongo/models/Users";
import connectToDatabase from "../mongo/dbConnection";

const userRouter = Router();

userRouter.post(
  "/api/users",
  async (req: Request, res: Response): Promise<void> => {
    try {
      await connectToDatabase();

      const { email, githubId, userId } = req.body;
      if (!email || !githubId || !userId) {
        res.status(400).send("Missing fields, could not save user");
        return;
      }

      console.log(email + " " + githubId + " " + userId);

      const newUser = new User({
        email,
        githubId,
        userId,
        activeProjects: [],
        archivedProjects: [],
      });

      await newUser.save();
      console.log("User " + userId + " saved successfully!");

      res.status(201).json(newUser);
      return;
    } catch (error) {
      console.error("Error saving user: ", error);
      res.status(500).send("Internal server error");
    }
  }
);

export default userRouter;
