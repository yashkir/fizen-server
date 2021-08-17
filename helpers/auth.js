const jwt = require('jsonwebtoken');
const User = require('../models/user');
const debug = require('debug')('api');

const SECRET = process.env.SECRET;

/**
 * Middleware that decodes a token in the 'Authorization' header,
 * finds the matching record, and attaches it to req.user
 */
async function ensureAuthenticated(req, res, next) {
  const token = req.get("Authorization");
  
  if (!token) {
    return res.status(401).json({ message: "'Authorization' header with token required." });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    const user = await User.findById(decoded.user._id);

    if (user === null) {
      return res.status(400).json({ message: "Token valid but user not found. Maybe deleted?" });
    }

    req.user = user.toObject();
  } catch (err) {
    debug(err);
    return res.status(500).json({ message: "Error decoding token." });
  }

  next();
}

module.exports = {
  ensureAuthenticated,
}
