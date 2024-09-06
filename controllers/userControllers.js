const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/ErrorHandler");
const { sendToken } = require("../utils/SendToken");
const imagekit = require("../utils/Imagekit").initImageKit();
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { sendMail } = require("../utils/Sendmail");

module.exports.homepage = catchAsyncErrors(async (req, res, next) => {
  const alluser = await User.find({ _id: { $ne: req.id } });
  res.status(200).json({ alluser });
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

module.exports.editUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.id, req.body, { new: true });

  if (!user) {
    return next(new ErrorHandler("Please login to access the resource", 404));
  }

  if (req.files) {
    // old file delete code
    if (user.profileImage.fileId !== "") {
      await imagekit.deleteFile(user.profileImage.fileId);
    }

    const file = req.files.profileImage;
    const modifiedFileName = uuidv4() + path.extname(file.name);

    const { fileId, url } = await imagekit.upload({
      file: file.data,
      fileName: modifiedFileName,
    });

    user.profileImage = { fileId, url };
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "User Updated Successfully",
    user,
  });
});

module.exports.sendMailUser = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(
      new ErrorHandler("User not found with this email address !", 404)
    );
  }

  const url = `${req.protocol}://${req.get("host")}/users/forget-link/${
    user._id
  }`;
  // send-mail
  sendMail(req, res, next, url);
  user.resetPasswordToken = "1";
  await user.save();

  res.status(200).json({ user, url });
});

module.exports.forgetPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("+password");

  if (!user) {
    return next(new ErrorHandler("User Not Found !", 404));
  }

  if (user.resetPasswordToken === "1") {
    user.resetPasswordToken = "0";
    user.password = req.body.password;
    await user.save();
  } else {
    return next(
      new ErrorHandler("Invalid Reset Password Link! please try again", 500)
    );
  }

  res.status(200).json({
    message: "Password Change Successfully",
  });
});
