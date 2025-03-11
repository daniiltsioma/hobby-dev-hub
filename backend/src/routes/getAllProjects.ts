import { Request, Response, Router } from "express";
import projectServices from "../services/projectServices";

const getAllProjectsRouter = Router();
const projectService = new projectServices();

getAllProjectsRouter.get(
  "/getAllProjects",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const projects = await projectService.returnAllProjects();

      if (!projects || projects.length === 0) {
        res.status(204).send("There are no current projects in the database");
        return;
      }
    } catch (error) {
      console.error("Error fetching all projects:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);
