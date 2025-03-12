import { Request, Response, Router } from "express";
import projectServices from "../services/projectServices";

const getOneProjectRouter = Router();
const projectService = new projectServices();

getOneProjectRouter.get(
  "/projects/:id/getOne",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ error: "Project ID is required" });
        return;
      }

      /*if (!owner) {
        res.status(400).json({ error: "Owner is required" });
        return;
      }*/

      const project = await projectService.getOneProject(id);

      if (!project) {
        res.status(404).json({ error: `No project with ID '${id}' found` });
        return;
      }

      res
        .status(200)
        .json({ success: true, message: "Project found!", project: project });
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default getOneProjectRouter;
