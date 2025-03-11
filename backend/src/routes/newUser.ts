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
      const { email, githubId, userId } = req.body;
      if (!email || !githubId || !userId) {
        res.status(400).json({ error: "Missing fields, could not save user" });
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

      res.status(201).json({
        success: true,
        message: "User created successfully!",
        user: newUser,
      });
    } catch (error) {
      console.error("Error saving user: ", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default userRouter;
