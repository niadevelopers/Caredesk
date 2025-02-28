const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongosh "mongodb+srv://cluster1.qhwmo.mongodb.net/" --apiVersion 1 --username jobisaacmaina22 --password 7brgJaSZ0fdH3pPs', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
