const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");
const { io, getReceiverSocketId } = require("../socket/socket");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const imagekit = require("../utils/Imagekit").initImageKit();
const ErrorHandler = require("../utils/ErrorHandler");

module.exports.sendMessage = catchAsyncErrors(async (req, res, next) => {
  const senderId = req.id;
  const receiverId = req.params.id;
  const { message } = req.body;
  const mimeType = req.files?.media?.mimetype.split("/")[0];

  let getConversation = await Conversation.findOne({
    participaints: { $all: [senderId, receiverId] },
  });

  if (!getConversation) {
    getConversation = await Conversation.create({
      participaints: [senderId, receiverId],
    });
  }

  // send new message
  const newMessage = await Message.create({
    senderId,
    receiverId,
    message,
  });

  // handle videos files and images
  if (req.files && req.files?.media) {
    const validMimeTypes = [
      // Image MIME types
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",

      // Video MIME types
      "video/mp4",
      "video/x-msvideo",
      "video/mpeg",
      "video/ogg",
      "video/webm",
      "video/3gpp",

      // Text file MIME types
      "text/plain",
    ];

    if (!validMimeTypes.includes(req.files?.media?.mimetype)) {
      return next(
        new ErrorHandler(
          "Invalid file type this file is not allowed ! Please choose another file",
          500
        )
      );
    }

    const maxSize = 10 * 1024 * 1024; // 10MB

    if (req.files?.media?.size > maxSize) {
      return next(
        new ErrorHandler(
          "File size exceeds the 10MB limit, Please select another file !",
          500
        )
      );
    }
    try {
      const file = req.files?.media;
      const modifiedFileName = uuidv4() + path.extname(file.name);

      const { fileId, url } = await imagekit.upload({
        file: file.data,
        fileName: modifiedFileName,
      });

      newMessage.media = { fileId, url, fileType: mimeType };
    } catch (error) {
      console.error("Failed to upload media on imagekit:", error);
    }
  }
  await newMessage.save();

  if (newMessage) {
    getConversation.messages.push(newMessage._id);
  }

  // await getConversation.save();
  await Promise.all([getConversation.save(), newMessage.save()]);

  //   soket.io
  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", newMessage);
  }

  return res.status(200).json({
    success: true,
    message: "Send Message Successfully",
    newMessage,
  });
});

module.exports.getMessage = catchAsyncErrors(async (req, res, next) => {
  const senderId = req.id;
  const receiverId = req.params.id;

  const conversation = await Conversation.findOne({
    participaints: { $all: [senderId, receiverId] },
  }).populate("messages");

  return res.status(200).json(conversation?.messages);
});
