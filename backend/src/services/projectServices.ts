import Project, { IProject } from "../mongo/models/Projects";
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
      if (
        !projectData.title ||
        !projectData.githubRepoURL ||
        !projectData.owner
      ) {
        throw new Error("Some required fields are missing");
      }

      /*const existingProject = await Project.findOne({
        title: { $regex: new RegExp(`^${projectData.title}$`, "i") },
        owner: projectData.owner,
      });

      if (existingProject) {
        throw new Error(
          `A project for user '${projectData.owner}' with the title '${projectData.title}' already exists.`
        );
      }*/

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
      const projects = await Project.find({});
      return projects;
    } catch (error) {
      console.error("Error fetching all projects", error);
      throw error;
    }
  }

  // get a single project
  async getOneProject(id: string) {
    try {
      await connectToDatabase();

      if (!id) {
        throw new Error("Missing project name in the search");
      }

      /*const project = await Project.findOne({
        title: { $regex: new RegExp(`^${title}$`, "i") },
        owner: { $regex: new RegExp(`^${owner}$`, "i") },
      })*/
      const project = await Project.findById({ _id: id })
        .populate("technologies")
        .populate("applicants")
        .populate("collaborators")
        .populate("tasks");

      if (!project) {
        throw new Error(`No project matches the id '${id}'`);
      }

      return project;
    } catch (error) {
      console.error("Error fetching project '" + id + "'", error);
      throw error;
    }
  }

  async addCollaborator(project: any, userToAddAsCollaborator: string) {
    try {
      await connectToDatabase();

      if (!userToAddAsCollaborator) {
        throw new Error("Collaborator name is required");
      }

      if (project.collaborators.includes(userToAddAsCollaborator)) {
        throw new Error(
          `User '${userToAddAsCollaborator}' is already a collaborator.`
        );
      }

      project.collaborators.push(userToAddAsCollaborator);
      await project.save();

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

      if (project.owner.toLowerCase() === userToRemove.toLowerCase()) {
        throw new Error("Cannot remove the project owner.");
      }

      if (
        !project.collaborators.some(
          (collab) => collab.toLowerCase() === userToRemove.toLowerCase()
        )
      ) {
        throw new Error(
          `User '${userToRemove}' is not a collaborator on this project.`
        );
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

  async addApplicant(project: any, userToApply: string) {
    try {
      if (!userToApply) {
        throw new Error("Username required");
      }

      if (!project || !project.applicants) {
        throw new Error("Invalid project data");
      }

      if (
        project.applicants.some(
          (applicant: string) =>
            applicant.toLowerCase() === userToApply.toLowerCase()
        )
      ) {
        throw new Error(`User '${userToApply}' has already applied`);
      }

      project.applicants.push(userToApply);
      await project.save();

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

      const applicantIndex = project.applicants.findIndex(
        (applicant) => applicant.toLowerCase() === username.toLowerCase()
      );

      if (applicantIndex === -1) {
        throw new Error(`User '${username}' is not an applicant.`);
      }

      project.applicants.splice(applicantIndex, 1);
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

  async searchProjects(query: string, tags?: string[]) {
    try {
      await connectToDatabase();

      let filter: any = {};

      if (query) {
        filter.$or = [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
          { technologies: { $in: [new RegExp(query, "i")] } },
        ];
      }

      if (tags && tags.length) {
        filter.technologies = { $all: tags };
      }

      // const projects = await Project.find(filter);
      const projects = await Project.find(filter).lean();

      return projects.map((proj) => ({ ...proj, _id: proj._id.toString() }));
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

      const filteredUpdateData = Object.fromEntries(
        Object.entries(updateData).filter(([key]) => validFields.includes(key))
      );

      if (Object.keys(filteredUpdateData).length === 0) {
        throw new Error("No valid fields provided for update.");
      }

      const updatedProject = await Project.findOneAndUpdate(
        { _id: projectId },
        { $set: filteredUpdateData },
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
        success: true,
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
