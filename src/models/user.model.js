const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Number, // 0 => User, 1 => Admin, 2 => SubAdmin 3 => Editor
      default: 0,
    },
  },
//   { strict: false } // Allows storing extra fields dynamically
);

const User = model("User", userSchema);
module.exports = User;
