import { Request, Response, Router } from "express";
import projectServices from "../services/projectServices";
import connectToDatabase from "../mongo/dbConnection";

const searchProjectRouter = Router();
const projectService = new projectServices();

searchProjectRouter.get(
  "/projects/search",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const query = req.query.search as string;
      const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

      try {
        const projects = await projectService.searchProjects(query || "", tags);

        res.status(200).json({ success: true, projects });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        res.status(400).json({ error: errorMessage });
      }
    } catch (error) {
      console.error("Error searching projects:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default searchProjectRouter;
