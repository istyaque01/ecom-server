import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: { type: String, enum: ["admin", "user"], default: "user" },
  },

  { timestamps: true }
);

export const userModel = mongoose.model("Users", userSchema);
