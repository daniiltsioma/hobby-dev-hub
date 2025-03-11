import { Request, Response, Router } from "express";
import connectToDatabase from "../mongo/dbConnection";
import projectServices from "../services/projectServices";

const getProjByUserRoleRouter = Router();
const projectService = new projectServices();

getProjByUserRoleRouter.get(
  "/getProjectsByRole",
  async (req: Request, res: Response): Promise<void> => {
    try {
      await connectToDatabase();

      const username = req.query.username as string;
      let role = req.query.role as string;
      role = role.toLowerCase();

      if (!username || !role) {
        res.status(400).send("Missing required parameters.");
        return;
      }

      const validRoles = [
        "owned",
        "applied",
        "collaborating",
        "archived",
      ] as const;
      type Role = (typeof validRoles)[number];

      if (!validRoles.includes(role as Role)) {
        res.status(400).json({ error: "Invalid role specified" });
        return;
      }

      const projects = await projectService.getProjectsByUserRole(
        username,
        role as Role
      );

      if (!projects || projects.length === 0) {
        res.status(404).json({ error: "No projects found for the given role" });
        return;
      }

      res.json({ projects });
    } catch (error) {
      console.error("Error fetching projects: ", error);
      res.status(500).send("Internal server error");
      return;
    }
  }
);

export default getProjByUserRoleRouter;
