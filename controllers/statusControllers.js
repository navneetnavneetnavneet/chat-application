const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const Status = require("../models/statusModel");
const User = require("../models/userModel");
const imagekit = require("../utils/Imagekit").initImageKit();
const { v4: uuidv4 } = require("uuid");
const path = require("path");

module.exports.uploadStatus = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.id);

  if (!user) {
    return next(new ErrorHandler("User Not Found !", 404));
  }

  if (req.files) {
    const file = req.files?.image;
    const modifiedFileName = uuidv4() + path.extname(file.name);

    const { fileId, url } = await imagekit.upload({
      file: file.data,
      fileName: modifiedFileName,
    });

    if (fileId && url) {
      const status = await Status.create({
        image: { fileId, url },
        user: user._id,
      });

      if (!status) {
        return next(new ErrorHandler("Internal Server Error !", 500));
      }

      user.status.push(status._id);
      await user.save();
    }
  }

  res.status(200).json({
    message: "Status uploaded successfully",
    user,
  });
});

module.exports.getAllStatus = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.id);

  if (!user) {
    return next(new ErrorHandler("User Not Found !", 404));
  }

  const status = await Status.find().populate({
    path: "user",
    populate: {
      path: "status",
    },
  });

  const obj = {};
  const filteredStatus = status.filter((s) => {
    if (!obj[s.user?._id]) {
      return (obj[s.user?._id] = "kuchh bhi");
    } else {
      return false;
    }
  });

  const loggedInUserStatus = filteredStatus.find(
    (s) => s.user?._id.toString() === user._id.toString()
  );

  const otherUserStatus = filteredStatus.filter(
    (s) => s.user?._id.toString() !== user._id.toString()
  );

  if (loggedInUserStatus) {
    otherUserStatus.unshift(loggedInUserStatus);
  }

  res.status(200).json({ allStatus: otherUserStatus });
});
