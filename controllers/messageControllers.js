const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");
const { io, getReceiverSocketId} = require("../socket/socket");

module.exports.sendMessage = catchAsyncErrors(async (req, res, next) => {
  const senderId = req.id;
  const receiverId = req.params.id;
  const { message } = req.body;

  let getConversation = await Conversation.findOne({
    participaints: { $all: [senderId, receiverId] },
  });

  if (!getConversation) {
    getConversation = Conversation.create({
      participaints: [senderId, receiverId],
    });
  }

  // send new message
  const newMessage = await Message.create({
    senderId,
    receiverId,
    message,
  });

  if (newMessage) {
    getConversation.messages.push(newMessage._id);
  }

  await getConversation.save();

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
