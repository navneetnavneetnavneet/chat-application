const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/ErrorHandler");
const { sendToken } = require("../utils/SendToken");

module.exports.homepage = catchAsyncErrors(async (req, res, next) => {
  res.json({ message: "homepage" });
});

module.exports.currentUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.id);

  if (!user) {
    return next(
      new ErrorHandler("User not found with this email address !", 404)
    );
  }

  res.status(200).json(user);
});

module.exports.signupUser = catchAsyncErrors(async (req, res, next) => {
  const user = await new User(req.body).save();
  sendToken(user, 201, res);
});

module.exports.signinUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Email and Password are required !", 500));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(
      new ErrorHandler("User not found with this email address !", 404)
    );
  }

  const isMath = await user.comparePassword(password);

  if (!isMath) {
    return next(new ErrorHandler("Wrong Credentials !", 500));
  }

  sendToken(user, 200, res);
});

module.exports.signoutUser = catchAsyncErrors(async (req, res, next) => {
  res.clearCookie("token");
  res.status(200).json({
    messsage: "User Logout Successfully",
  });
});
