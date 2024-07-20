import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    dp: {
      type: String,
      default: "newUser.png"
    },
    password: {
      type: String,
      required: true,
    },
    designs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Design",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
