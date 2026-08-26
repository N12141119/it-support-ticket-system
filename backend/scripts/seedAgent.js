const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');

dotenv.config({ path: require('path').join(__dirname, '..', '.env') });

const run = async () => {
  if (!process.env.AGENT_NAME || !process.env.AGENT_EMAIL || !process.env.AGENT_PASSWORD) {
    throw new Error('AGENT_NAME, AGENT_EMAIL and AGENT_PASSWORD must be set in backend/.env');
  }
  await connectDB();
  const email = process.env.AGENT_EMAIL.trim().toLowerCase();
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name: process.env.AGENT_NAME.trim(),
      email,
      password: process.env.AGENT_PASSWORD,
      role: 'agent',
    });
    console.log(`Created Agent account: ${user.email}`);
  } else {
    user.name = process.env.AGENT_NAME.trim();
    user.role = 'agent';
    user.password = process.env.AGENT_PASSWORD;
    await user.save();
    console.log(`Updated Agent account: ${user.email}`);
  }
  process.exit(0);
};

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
