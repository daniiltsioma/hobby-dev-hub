import { Request, Response, Router } from "express";
import projectServices from "../services/projectServices";

const getProjByUserRoleRouter = Router();
const projectService = new projectServices();

getProjByUserRoleRouter.get(
  "/getProjectsByRole",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const username = req.query.username?.toString().trim();
      let role = req.query.role?.toString().trim().toLowerCase();

      if (!username) {
        res.status(400).json({ error: "Username is required." });
        return;
      }
      if (!role) {
        res.status(400).json({ error: "Role is required." });
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
        res.status(400).json({
          error: `Invalid role specified. Must be one of: ${validRoles.join(
            ", "
          )}`,
        });
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

      res
        .status(200)
        .json({
          success: true,
          message: "Project(s) found!",
          projects: projects,
        });
    } catch (error) {
      console.error("Error fetching projects:", error);
      res
        .status(500)
        .json({ error: "Internal server error. Please try again later." });
    }
  }
);

export default getProjByUserRoleRouter;
