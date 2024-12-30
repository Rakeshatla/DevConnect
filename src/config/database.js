const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://atlarakesh005:RoUzxMGa0JYmxb1d@devtinder.e8xcl.mongodb.net/')
}

module.exports = connectDB;
