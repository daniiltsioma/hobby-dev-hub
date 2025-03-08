import mongoose, { model, Schema, InferSchemaType } from "mongoose";

const ProjectSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: false },
  githubRepoURL: { type: String, required: true },
  technologies: { type: [String], required: true },
  owner: { type: String, required: true },
  applicants: { type: [String], default: [] },
  collaborators: { type: [String], default: [] },
  tasks: { type: [String], default: [] },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  isArchived: { type: Boolean, default: false },
});

type IProject = InferSchemaType<typeof ProjectSchema>;

const Project = model<IProject>("Project", ProjectSchema);

export default Project;
export type { IProject };
