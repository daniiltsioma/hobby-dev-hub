import { Request, Response, Router } from "express";
import projectServices from "../services/projectServices";

const getOneProjectRouter = Router();
const projectService = new projectServices();

getOneProjectRouter.get(
  "/getAllProjects",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const title = req.query.title?.toString().trim();
      const owner = req.query.owner?.toString().trim();

      if (!title) {
        res.status(400).json({ error: "Project title is required" });
        return;
      }

      if (!owner) {
        res.status(400).json({ error: "Owner is required" });
        return;
      }

      const project = await projectService.getOneProject(title, owner);

      if (!project) {
        res
          .status(404)
          .json({ error: `No project named '${title}' found for '${owner}'` });
        return;
      }

      res
        .status(200)
        .json({ success: true, message: "Project found!", project: project });
    } catch (error) {
      console.error("Error fetching all projects:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default getOneProjectRouter;
