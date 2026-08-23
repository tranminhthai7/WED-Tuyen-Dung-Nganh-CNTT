const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  const userId = user._id ? user._id.toString() : user.id;

  return jwt.sign(
    {
      id: userId,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || 'itmatch-secret',
    { expiresIn: '7d' }
  );
};

module.exports = { generateToken };
