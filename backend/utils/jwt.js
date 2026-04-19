const jwt = require('jsonwebtoken');
const config = require('../config');

const generateToken = (userId, role, department) => {
  return jwt.sign(
    { userId, role, department },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};

module.exports = {
  generateToken,
};
