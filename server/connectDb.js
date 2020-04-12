require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    //connect Mongo
    await mongoose.connect(process.env.DATABASE_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    //exit process with failure...
    process.exit(1);
  }
};

module.exports = connectDB;
