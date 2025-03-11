import Project from "../mongo/models/Projects";
import connectToDatabase from "../mongo/dbConnection";
import { isValidObjectId } from "mongoose";

export default class projectServices {
  async createProject(projectData: {
    title: string;
    githubRepoURL: string;
    description?: string;
    technologies?: string[];
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
          { owner: { $regex: new RegExp(`^${username}$`, "i") } },
          { collaborators: { $regex: new RegExp(`^${username}$`, "i") } },
          { applicants: { $regex: new RegExp(`^${username}$`, "i") } },
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
            owner: { $ne: username },
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

      const projects = await Project.find(query)
        .populate("technologies")
        .populate("applicants")
        .populate("collaborators")
        .populate("tasks");
      return projects;
    } catch (error) {
      console.error(`Error fetching projects for role '${role}'`, error);
      throw error;
    }
  }

  // return all projects
  async returnAllProjects() {
    try {
      await connectToDatabase();
      const projects = await Project.find({});
      return projects;
    } catch (error) {
      console.error("Error fetching all projects", error);
      throw error;
    }
  }

  // get a single project
  async getOneProject(title: string, owner: string) {
    try {
      await connectToDatabase();

      if (!title || !owner) {
        throw new Error("Missing project name in the search");
      }

      const project = await Project.findOne({
        title: { $regex: new RegExp(`^${title}$`, "i") },
        owner: { $regex: new RegExp(`^${owner}$`, "i") },
      })
        .populate("technologies")
        .populate("applicants")
        .populate("collaborators")
        .populate("tasks");

      if (!project) {
        throw new Error(`No project matches the name '${title}'`);
      }

      return project;
    } catch (error) {
      console.error("Error fetching project '" + title + "'", error);
      throw error;
    }
  }

  async addCollaborator(projectId: string, userToAddAsCollaborator: string) {
    try {
      await connectToDatabase();

      if (!isValidObjectId(projectId)) {
        throw new Error("Invalid project ID.");
      }

      if (!projectId || !userToAddAsCollaborator) {
        throw new Error("One or more required arguments is empty");
      }
      const project = await Project.findById(projectId);
      if (!project) {
        throw new Error("Project not found.");
      }

      if (!project.collaborators.includes(userToAddAsCollaborator)) {
        project.collaborators.push(userToAddAsCollaborator);
        await project.save();
      }

      return project;
    } catch (error) {
      console.error(
        "Error adding collaborator '" + userToAddAsCollaborator + "'",
        error
      );
      throw error;
    }
  }

  async removeCollaborator(projectId: string, userToRemove: string) {
    try {
      await connectToDatabase();

      if (!isValidObjectId(projectId)) {
        throw new Error("Invalid project ID.");
      }

      if (!projectId || !userToRemove) {
        throw new Error("One or more required arguments is empty");
      }

      const project = await Project.findById(projectId);

      if (!project) {
        throw new Error("Project not found");
      }

      project.collaborators = project.collaborators.filter(
        (collab) => collab.toLowerCase() !== userToRemove.toLowerCase()
      );

      await project.save();

      return project;
    } catch (error) {
      console.error("Error removing collaborator", error);
      throw error;
    }
  }

  async addApplicant(projectId: string, username: string) {
    try {
      await connectToDatabase();

      if (!isValidObjectId(projectId)) {
        throw new Error("Invalid project ID.");
      }

      const project = await Project.findById(projectId);
      if (!project) {
        throw new Error("Project not found.");
      }

      if (!project.applicants.includes(username)) {
        project.applicants.push(username);
        await project.save();
      }

      return project;
    } catch (error) {
      console.error("Error adding applicant", error);
      throw error;
    }
  }

  async removeApplicant(projectId: string, username: string) {
    try {
      await connectToDatabase();

      if (!isValidObjectId(projectId)) {
        throw new Error("Invalid project ID.");
      }

      const project = await Project.findById(projectId);
      if (!project) {
        throw new Error("Project not found.");
      }

      project.applicants = project.applicants.filter(
        (applicant) => applicant.toLowerCase() !== username.toLowerCase()
      );
      await project.save();

      return project;
    } catch (error) {
      console.error("Error removing applicant", error);
      throw error;
    }
  }

  async archiveProject(projectId: string) {
    try {
      await connectToDatabase();

      if (!isValidObjectId(projectId)) {
        throw new Error("Invalid project ID.");
      }

      if (!projectId) {
        throw new Error("No project provided to archive");
      }

      const project = await Project.findById(projectId);
      if (!project) {
        throw new Error("Project not found.");
      }

      project.isArchived = true;
      await project.save();

      return project;
    } catch (error) {
      console.error("Error archiving project", error);
      throw error;
    }
  }

  async unarchiveProject(projectId: string) {
    try {
      await connectToDatabase();

      if (!isValidObjectId(projectId)) {
        throw new Error("Invalid project ID.");
      }

      const project = await Project.findById(projectId);
      if (!project) {
        throw new Error("Project not found.");
      }

      project.isArchived = false;
      await project.save();

      return project;
    } catch (error) {
      console.error("Error unarchiving project", error);
      throw error;
    }
  }

  async searchProjects(query: string) {
    try {
      await connectToDatabase();

      const projects = await Project.find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
          { technologies: { $in: [new RegExp(query, "i")] } },
        ],
      });

      return projects;
    } catch (error) {
      console.error("Error searching projects", error);
      throw error;
    }
  }

  async updateProject(projectId: string, updateData: Partial<typeof Project>) {
    try {
      await connectToDatabase();

      if (!isValidObjectId(projectId)) {
        throw new Error("Invalid project ID.");
      }

      const validFields = [
        "title",
        "description",
        "githubRepoURL",
        "technologies",
        "applicants",
        "collaborators",
        "tasks",
        "startDate",
        "endDate",
        "isArchived",
      ];

      for (const key in updateData) {
        if (!validFields.includes(key)) {
          throw new Error(`Invalid field: ${key}`);
        }
      }

      const updatedProject = await Project.findOneAndUpdate(
        { _id: projectId },
        updateData,
        { new: true }
      );

      if (!updatedProject) {
        throw new Error(`No project exists with ID '${projectId}'`);
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
  async deleteProject(projectId: string) {
    try {
      await connectToDatabase();

      if (!isValidObjectId(projectId)) {
        throw new Error("Invalid project ID.");
      }

      if (!projectId) {
        throw new Error(
          "Required parameter not provided. Please provide the project name and URL."
        );
      }

      const deletedProject = await Project.findByIdAndDelete(projectId);
      if (!deletedProject) {
        throw new Error(`Could not find the project with ID '${projectId}'`);
      }

      return {
        message: `Project with title '${deletedProject.title}' has been successfully deleted`,
      };
    } catch (error) {
      console.error(
        "Error: could not delete project '" + projectId + "'",
        error
      );
      throw error;
    }
  }
}
