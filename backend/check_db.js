require('dotenv').config();
const { connectDB } = require('./src/config/database');
const { User } = require('./src/models');

const checkUser = async () => {
  try {
    await connectDB();
    console.log('Connected to DB');

    const users = await User.findAll({
      order: [['createdAt', 'DESC']],
      limit: 1,
    });

    console.log('Latest User:', users.map((u) => u.toJSON()));
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

checkUser();
