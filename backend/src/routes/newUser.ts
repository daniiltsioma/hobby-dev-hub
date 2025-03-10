import { Request, Response, Router } from "express";
import User from "../mongo/models/Users";
import connectToDatabase from "../mongo/dbConnection";
import UserService from "../services/userServices";

const userRouter = Router();
const userService = new UserService();

userRouter.post(
  "/newUser",
  async (req: Request, res: Response): Promise<void> => {
    try {
      await connectToDatabase();

      const { email, githubId, userId } = req.body;
      if (!email || !githubId || !userId) {
        res.status(400).send("Missing fields, could not save user");
        return;
      }

      const newUser = await userService.createUser({
        email,
        githubId,
        userId,
      });

      if (!newUser) {
        res
          .status(500)
          .json({ error: "User could not be created due to a server error" });
        return;
      }

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
