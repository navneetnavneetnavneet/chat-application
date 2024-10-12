const mongoose = require("mongoose");

module.exports.connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverApi: { version: "1", strict: true, deprecationErrors: true },
    });
    console.log("Database Connection Established");
  } catch (error) {
    console.log(error);
  }
};
