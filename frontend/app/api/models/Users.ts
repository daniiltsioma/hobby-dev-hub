import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  githubId: string;
  userId: number;
}

const UserSchema: Schema = new mongoose.Schema({
  email: { type: String, required: true },
  githubId: { type: String, required: true },
  userId: { type: Number, required: true },
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
