import mongoose, { Schema, Types, model, InferSchemaType } from "mongoose";
import { IProject } from "./Projects";

const UserSchema = new Schema({
  email: { type: String, required: true },
  githubId: { type: String, required: true },
  userId: { type: Number, required: true },
  activeProjects: [{ type: Types.ObjectId, ref: "Project" }],
  archivedProjects: [{ type: Types.ObjectId, ref: "Project" }],
});

type IUser = InferSchemaType<typeof UserSchema>;
const User = mongoose.model<IUser>("User", UserSchema);

export default User;
export type { IUser };
