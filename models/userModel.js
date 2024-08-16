const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required !"],
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: [true, "fullName is required !"],
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Email is required !"],
      trim: true,
    },
    password: {
      type: String,
      select: false,
      required: [true, "Password is required !"],
      trim: true,
      maxLength: [16, "Password Should not be exceed more than 16 character !"],
      minLength: [16, "Password Should have atleast 6 character !"],
    },
    profileImage: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", userSchema);
