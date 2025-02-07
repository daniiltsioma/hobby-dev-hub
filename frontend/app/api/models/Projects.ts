import mongoose, { Document, Schema } from "mongoose";

export interface IProject extends Document {
  name: String;
  repoURL: String;
  description: String;
  sprintStatus: "Active" | "Completed";
  users: mongoose.Schema.Types.ObjectId[];
  startDate: Date;
  endDate: Date;
}

const ProjectSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  repoURL: { type: String, required: true },
  description: { type: String, required: false },
  sprintStatus: {
    type: String,
    enum: ["Active", "Completed"],
    default: "Active",
  },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
});

const Project = mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
