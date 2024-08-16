const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
    email: {
      type: String,
      required: [true, "Email is required !"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      select: false,
      required: [true, "Password is required !"],
      trim: true,
      maxLength: [16, "Password Should not be exceed more than 16 character !"],
      minLength: [6, "Password Should have atleast 6 character !"],
    },
    profileImage: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLSc0PAlRfet50plvDWIqsivH5ffUlc_LgfQ&s",
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

userSchema.pre("save", function () {
  if (!this.isModified("password")) {
    return;
  }

  let salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("user", userSchema);
