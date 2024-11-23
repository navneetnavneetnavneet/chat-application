const mongoose = require("mongoose");

module.exports.connectDatabase = async () => {
  try {
    // await mongoose.connect(process.env.MONGODB_URI, {
    //   serverApi: { version: "1", strict: true, deprecationErrors: true },
    // });
    await mongoose.connect("mongodb://127.0.0.1:27017/chatApplication")
    console.log("Database Connection Established");
  } catch (error) {
    console.log(error);
  }
};


