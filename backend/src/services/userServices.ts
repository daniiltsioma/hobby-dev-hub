import User from "../mongo/models/Users";
import connectToDatabase from "../mongo/dbConnection";
import { error } from "console";

class UserService {
  // Create a new user and save them in the db
  async createUser(userData: {
    email: string;
    githubId: string;
    userId: string;
  }) {
    try {
      await connectToDatabase();

      if (!userData.email || !userData.githubId || !userData.userId) {
        throw new Error("Missing required fields: email, githubId, or userId");
      }

      const existingUser = await User.findOne({
        $or: [
          { userId: userData.userId },
          { email: userData.email },
          { githubId: userData.githubId },
        ],
      });

      if (existingUser) {
        throw new Error("User already exists");
      }

      const newUser = new User(userData);
      return await newUser.save();
    } catch (error) {
      console.error("Error saving the user '" + userData.userId + "'", error);
      throw error;
    }
  }

  // get a user from the db
  async getUser(githubId: string) {
    try {
      await connectToDatabase();

      const user = await User.findOne({ githubId })
        .populate("activeProjects")
        .populate("archivedProjects");

      if (!user) {
        throw new Error(`User with githubId '${githubId}' not found`);
      }

      return user;
    } catch (error) {
      console.error("Error fetching user '" + githubId + "'", error);
      throw error;
    }
  }

  // Update an existing user
  async updateUser(githubId: string, updateData: Partial<typeof User>) {
    try {
      await connectToDatabase();

      const validFields = [
        "email",
        "githubId",
        "userId",
        "activeProjects",
        "archivedProjects",
      ];
      for (const key in updateData) {
        if (!validFields.includes(key)) {
          throw new Error(`Invalid field: ${key}`);
        }
      }

      const updatedUser = await User.findOneAndUpdate(
        { githubId },
        updateData,
        { new: true }
      );

      if (!updatedUser) {
        throw new Error(`The user with githubId '${githubId}' does not exist.`);
      }

      return updatedUser;
    } catch (error) {
      console.error("Error updating user: ", error);
      throw error;
    }
  }

  async deleteUser(githubId: string) {
    try {
      await connectToDatabase();

      const deletedUser = await User.findOneAndDelete({ githubId });

      if (!deletedUser) {
        throw new Error(`User with githubId '${githubId}' not found`);
      }

      return {
        message: `User with githubId '${githubId}' deleted successfully`,
      };
    } catch (error) {
      console.error("Error: could not delete user '" + githubId + "'", error);
      throw error;
    }
  }
}
