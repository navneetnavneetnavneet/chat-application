const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");

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

  return res.status(200).json({
    success: true,
    message: "Send Message Successfully",
  });
});


