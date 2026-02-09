const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const users = await User.find({}).sort({ createdAt: -1 }).limit(1);
        console.log('Latest User:', users);

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkUser();
