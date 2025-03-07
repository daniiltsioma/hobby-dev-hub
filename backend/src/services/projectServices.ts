import Project from "../mongo/models/Projects";
import User from "../mongo/models/Users";
import connectToDatabase from "../mongo/dbConnection";
import { ObjectId } from "mongoose";
import { IUser } from "../mongo/models/Users";

// TODO: IGNORE CASE OF NAME
export default class projectServices {
  async createProject(projectData: {
    name: string;
    repoUrl: string;
    description?: string;
    tags: string[];
    owner: IUser;
    sprintStatus?: string;
    approvedUsers?: string;
    tasks?: string[];
    startDate?: Date;
    endDate?: Date;
  }) {
    try {
      await connectToDatabase();

      if (
        !projectData.name ||
        !projectData.repoUrl ||
        !projectData.tags ||
        !projectData.owner
      ) {
        throw new Error("Some required fields are missing");
      }

      const existingProject = await Project.findOne(
        { name: projectData.name },
        { owner: projectData.owner }
      );
      if (existingProject) {
        const githubId = projectData.owner.githubId;
        throw new Error(
          `A project for user '${githubId}' with the name '${projectData.name}' already exists.`
        );
      }

      const newProject = new Project(projectData);
      return await newProject.save();
    } catch (error) {
      console.error(
        "Error creating the new project '" + projectData.name + "'",
        error
      );
      throw error;
    }
  }

  async getProject(name: string) {
    try {
      await connectToDatabase();

      if (!name) {
        throw new Error("Missing project name in the search");
      }

      const project = Project.find({ name })
        .populate("tags")
        .populate("approvedUsers")
        .populate("applicants")
        .populate("tasks");

      if (!project) {
        throw new Error(`No project matches the name '${name}'`);
      }

      return project;
    } catch (error) {
      console.error("Error fetching project '" + name + "'", error);
      throw error;
    }
  }

  async updateProject(name: string, updateData: Partial<typeof Project>) {
    try {
      await connectToDatabase();

      const validFields = [
        "name",
        "repoURL",
        "description",
        "tags",
        "owner",
        "sprintStatus",
        "approvedUsers",
        "applicants",
        "tasks",
        "startDate",
        "endDate",
      ];

      for (const key in updateData) {
        if (!validFields.includes(key)) {
          throw new Error(`Invalid field: ${key}`);
        }
      }

      const updatedProject = await Project.findOneAndUpdate(
        { name },
        updateData,
        { new: true }
      );

      if (!updatedProject) {
        throw new Error(`No project exists under the name '${name}'`);
      }

      return updatedProject;
    } catch (error) {
      console.error("Error could not update project", error);
      throw error;
    }
  }

  // Since no user can have multiple projects with the same name
  //
  async deleteProject(name: string) {
    try {
      await connectToDatabase();

      if (!name) {
        throw new Error(
          "Required parameter not provided. Please provide the project name and URL."
        );
      }

      const deletedProject = await User.findOneAndDelete({ name });
      if (!deletedProject) {
        throw new Error(
          `Could not find the project '${name}' paired with the given ID`
        );
      }

      return {
        message: `Project with name '${name}' has been successfully deleted`,
      };
    } catch (error) {
      console.error("Error: could not delete project '" + name + "'", error);
      throw error;
    }
  }
}
