import { Request, Response, Router } from "express";
import connectToDatabase from "../mongo/dbConnection";
import { Types } from "mongoose";
import Project from "../mongo/models/Projects";

const applyingRouter = Router();

applyingRouter.post(
  "/project/apply/:id",
  async (
    req: Request<{ id: string }, {}, { applicantId: string }>,
    res: Response
  ): Promise<void> => {
    try {
      await connectToDatabase();
      const { id } = req.params;
      const { applicantId } = req.body;

      if (!id || id === null || !Types.ObjectId.isValid(applicantId)) {
        res.status(400).json("Invalid project ID or applicant ID.");
        return;
      }

      const project = await Project.findById(id);
      if (!project) {
        res.status(404).json("Project not found.");
        return;
      }

      const applicantObjectId = new Types.ObjectId(applicantId);

      if (project.applicants.some((applicant: any) => applicant.toString() === applicantObjectId.toString())) {
        res.status(401).json("User has already applied.");
        return;
      }

      project.applicants.push(applicantObjectId);
      await project.save();

      res.status(200).json({ message: "Application submitted successfully!", project });
    } catch (error) {
      console.error("Error applying to project:", error);
      res.status(500).send("Internal server error");
    }
  }
);

export default applyingRouter;