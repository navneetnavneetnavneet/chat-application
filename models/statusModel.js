const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema({
  image: {
    type: Object,
    required: [true, "Image is required !"],
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  createdAt: { type: Date, default: Date.now },
  expiresAt: {
    type: Date,
    default: () => Date.now() + 24 * 60 * 60 * 1000,
    index: { expires: "1d" },
  },
});

// Middleware to remove the story from the user's stories array when it expires
statusSchema.post("remove", async function (status) {
  try {
    await mongoose.model("user").findByIdAndUpdate(status.user, {
      $pull: {status: status._id}
    })
  } catch (error) {
    console.log("Error updating user status : ", error);
  }
});

module.exports = mongoose.model("status", statusSchema);
