const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CATEGORIES = ['Hardware', 'Software', 'Network', 'Account / Access', 'Email', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

const isValidEmail = (email = '') => EMAIL_REGEX.test(String(email).trim().toLowerCase());
const isStrongEnoughPassword = (password = '') => String(password).length >= 8;
const isValidCategory = (category) => CATEGORIES.includes(category);
const isValidPriority = (priority) => PRIORITIES.includes(priority);

module.exports = {
  CATEGORIES,
  PRIORITIES,
  isValidEmail,
  isStrongEnoughPassword,
  isValidCategory,
  isValidPriority,
};
