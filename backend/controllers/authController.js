const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { isValidEmail, isStrongEnoughPassword } = require('../utils/validation');

const generateToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  token: generateToken(user),
});

const registerUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Name, email, password and confirm password are required' });
  }
  if (String(name).trim().length < 2) return res.status(400).json({ message: 'Name must contain at least 2 characters' });
  if (!isValidEmail(email)) return res.status(400).json({ message: 'Enter a valid email address' });
  if (!isStrongEnoughPassword(password)) return res.status(400).json({ message: 'Password must contain at least 8 characters' });
  if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' });

  try {
    const normalEmail = String(email).trim().toLowerCase();
    const userExists = await User.findOne({ email: normalEmail });
    if (userExists) return res.status(400).json({ message: 'An account with this email already exists' });

    const user = await User.create({
      name: String(name).trim(),
      email: normalEmail,
      password,
      role: 'employee',
    });

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      message: 'Registration successful. Please log in.',
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
  if (!isValidEmail(email)) return res.status(400).json({ message: 'Enter a valid email address' });

  try {
    const user = await User.findOne({ email: String(email).trim().toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    return res.json(publicUser(user));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  res.json({ id: req.user.id, name: req.user.name, email: req.user.email, role: req.user.role });
};

const updateUserProfile = async (req, res) => {
  const { name, email } = req.body;
  if (name !== undefined && String(name).trim().length < 2) return res.status(400).json({ message: 'Name must contain at least 2 characters' });
  if (email !== undefined && !isValidEmail(email)) return res.status(400).json({ message: 'Enter a valid email address' });

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (email && String(email).trim().toLowerCase() !== user.email) {
      const duplicate = await User.findOne({ email: String(email).trim().toLowerCase(), _id: { $ne: user._id } });
      if (duplicate) return res.status(400).json({ message: 'An account with this email already exists' });
      user.email = String(email).trim().toLowerCase();
    }
    if (name) user.name = String(name).trim();

    const updated = await user.save();
    return res.json(publicUser(updated));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, updateUserProfile, getProfile };
