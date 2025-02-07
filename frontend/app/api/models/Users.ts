import mongoose, { Document, Schema } from "mongoose";
export interface IUser extends Document {
  email: string;
  githubId: string;
  userId: number;
  activeProjects: mongoose.Schema.Types.ObjectId[];
  archivedProjects: mongoose.Schema.Types.ObjectId[];
}

const UserSchema: Schema = new mongoose.Schema({
  email: { type: String, required: true },
  githubId: { type: String, required: true },
  userId: { type: Number, required: true },
  activeProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  archivedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
