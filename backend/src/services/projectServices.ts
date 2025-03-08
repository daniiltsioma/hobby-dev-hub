import Project from "../mongo/models/Projects";
import User from "../mongo/models/Users";
import connectToDatabase from "../mongo/dbConnection";
import { ObjectId } from "mongoose";
import { IUser } from "../mongo/models/Users";

// TODO: IGNORE CASE OF NAME
export default class projectServices {
  async createProject(projectData: {
    title: string;
    githubRepoURL: string;
    description?: string;
    technologies: string[];
    owner: string;
    applicants?: string[];
    collaborators?: string;
    tasks?: string[];
    startDate?: Date;
    endDate?: Date;
    isArchived?: boolean;
  }) {
    try {
      await connectToDatabase();

      if (
        !projectData.title ||
        !projectData.githubRepoURL ||
        !projectData.technologies ||
        !projectData.owner
      ) {
        throw new Error("Some required fields are missing");
      }

      const existingProject = await Project.findOne({
        title: { $regex: new RegExp(`^${projectData.title}$`, "i") },
        owner: projectData.owner,
      });

      if (existingProject) {
        throw new Error(
          `A project for user '${projectData.owner}' with the title '${projectData.title}' already exists.`
        );
      }

      const newProject = new Project(projectData);
      return await newProject.save();
    } catch (error) {
      console.error(
        "Error creating the new project '" + projectData.title + "'",
        error
      );
      throw error;
    }
  }

  // return all projects for a specific owner
  async returnAllProjectsForAnOwner(username: string) {
    try {
      await connectToDatabase();

      if (!username) {
        throw new Error("No username provided, cannot fetch the projects");
      }

      const projects = await Project.find({
        $or: [
          { owner: username },
          { collaborators: username },
          { applicants: username },
        ],
      });

      return projects;
    } catch (error) {
      console.error(`Error fetching projects for user '${username}'`, error);
      throw error;
    }
  }

  // get projects based on user role
  async getProjectsByUserRole(
    username: string,
    role: "owned" | "applied" | "collaborating" | "archived"
  ) {
    try {
      await connectToDatabase();

      let query = {};
      switch (role) {
        case "owned":
          query = {
            owner: { $regex: new RegExp(`^${username}$`, "i") },
            isArchived: false,
          };
          break;
        case "collaborating":
          query = {
            collaborators: { $regex: new RegExp(`^${username}$`, "i") },
            owner: { $ne: { $regex: new RegExp(`^${username}$`, "i") } },
            isArchived: false,
          };
          break;
        case "archived":
          query = {
            isArchived: true,
            $or: [
              { owner: { $regex: new RegExp(`^${username}$`, "i") } },
              { collaborators: { $regex: new RegExp(`^${username}$`, "i") } },
            ],
          };
          break;
        default:
          throw new Error("Invalid role specified.");
      }

      const projects = await Project.find(query);
      return projects;
    } catch (error) {
      console.error(`Error fetching projects for role '${role}'`, error);
      throw error;
    }
  }

  // get a single project
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

  async addCollaborator(
    title: string,
    owner: string,
    userToAddAsCollaborator: string
  ) {
    try {
      await connectToDatabase();

      if (!title || !owner || !userToAddAsCollaborator) {
        throw new Error("One or more required arguments is empty");
      }
      const project = await Project.findOne(
        { $regex: new RegExp(`^${title}$`, "i") },
        { $regex: new RegExp(`^${owner}$`, "i") }
      );
      if (!project) {
        throw new Error("Project not found.");
      }

      if (!project.applicants.includes(userToAddAsCollaborator)) {
        project.applicants.push(userToAddAsCollaborator);
        await project.save();
      }

      return project;
    } catch (error) {
      console.error(
        "Error adding applicant '" + userToAddAsCollaborator + "'",
        error
      );
      throw error;
    }
  }

  async removeCollaborator(title: string, owner: string, userToRemove: string) {
    try {
      await connectToDatabase();

      if (!title || !owner || !userToRemove) {
        throw new Error("One or more required arguments is empty");
      }

      const project = await Project.findOne(
        { $regex: new RegExp(`^${title}$`, "i") },
        { $regex: new RegExp(`^${owner}$`, "i") }
      );

      if (!project) {
        throw new Error("Project not found");
      }

      project.collaborators = project.collaborators.filter(
        (collab) => collab.toLowerCase() !== userToRemove.toLowerCase()
      );

      await project.save();

      return project;
    } catch (error) {}
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

  // Since no user can have multiple projects with the same name,
  // and only a user can delete their own projects, we only need
  // to search by name
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
