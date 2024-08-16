const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const User = require("../models/userModel");

module.exports.homepage = catchAsyncErrors(async (req, res, next) => {
  res.json({ message: "homepage" });
});

module.exports.signupUser = catchAsyncErrors(async (req, res, next) => {
  const user = await new User(req.body).save();
  res.status(201).json(user);
});
