import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./Users";

export interface IProject extends Document {
    name: String;
    repoURL: string;
    description: String;
    sprintStatus: "Active" | "Completed";
    approvedUsers: IUser[];
    applicants: IUser[];
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
    approvedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    applicants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
});

const Project = mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
