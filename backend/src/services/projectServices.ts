import Project from "../mongo/models/Projects";
import User from "../mongo/models/Users";
import connectToDatabase from "../mongo/dbConnection";

class projectServices {
  async createProject(projectData: {
    name: string;
    repoUrl: string;
    description?: string;
    tags: string[];
    owner: typeof User;
    sprintStatus?: string;
    approvedUsers?: string;
    tasks?: string[];
    startDate?: Date;
    endDate?: Date;
  }) {}
}
