const mongoose = require("mongoose");

module.exports.connectDatabase = async () => {
  try {
    // MONGODB_URI=mongodb+srv://navneetsinghsolanki:XbewOyWDenvUoM8F@cluster0.9rmzi.mongodb.net/chatApplication?retryWrites=true&w=majority&appName=Cluster0
    await mongoose.connect(process.env.MONGODB_URI, {
      serverApi: { version: "1", strict: true, deprecationErrors: true },
    });
    console.log("Database Connection Established");
  } catch (error) {
    console.log(error);
  }
};
