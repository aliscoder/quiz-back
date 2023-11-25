import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface UserInterface extends Document {
  name: string;
  phone: string;
  point: number;
  avatar: Types.ObjectId;
  username: string;
  password: string;
}

const userSchema: Schema = new mongoose.Schema<UserInterface>({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  point: {
    type: Number,
    default: 0,
  },
  avatar: {
    type: Schema.Types.ObjectId,
    required: false,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

//@ts-ignore
const User: Model<UserInterface> = mongoose.model("User", userSchema);

export default User;
