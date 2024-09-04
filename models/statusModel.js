const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema(
  {
    image: {
      type: Object,
      required: [true, "Image is required !"],
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("status", statusSchema);
