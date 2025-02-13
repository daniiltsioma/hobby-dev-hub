import mongoose, { Document, Schema } from "mongoose";
import { IProject } from "./Projects";
export interface IUser extends Document {
    email: string;
    githubId: string;
    userId: number;
    activeProjects: IProject[];
    archivedProjects: IProject[];
}

const UserSchema: Schema = new mongoose.Schema({
    email: { type: String, required: true },
    githubId: { type: String, required: true },
    userId: { type: Number, required: true },
    activeProjects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
    archivedProjects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
