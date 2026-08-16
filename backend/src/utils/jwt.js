const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || 'itmatch-secret',
    { expiresIn: '7d' }
  );
};

module.exports = { generateToken };
