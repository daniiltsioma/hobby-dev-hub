import mongoose, { model, Schema, Types, InferSchemaType } from "mongoose";

const ProjectSchema = new Schema({
  name: { type: String, required: true },
  repoURL: { type: String, required: true },
  description: { type: String, required: false },
  tags: {
    type: [String],
    enum: ["React", "Node.js", "MongoDB", "Python", "NumPy", "C++", "SFML"],
    required: true,
  },
  owner: { type: Types.ObjectId, ref: "User", required: true },
  sprintStatus: {
    type: String,
    enum: ["Active", "Completed"],
    default: "Active",
  },
  approvedUsers: [{ type: Types.ObjectId, ref: "User" }],
  applicants: [{ type: Types.ObjectId, ref: "User" }],
  tasks: { type: [String], default: [] },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
});

type IProject = InferSchemaType<typeof ProjectSchema>;

const Project = model<IProject>("Project", ProjectSchema);

export default Project;
export type { IProject };
