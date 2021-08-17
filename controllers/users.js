const uuid = require('uuid');
const debug = require('debug')('api');
const User = require('../models/user');
const auth = require('../helpers/auth');

/**
 * Create a user using a { name, password } body.
 * Replies with { user } on success.
 */
async function create(req, res) {
  try {
    const found = await User.findOne({ name: req.body.name });
    if (found) {
      return res.status(400).json({ "message": "User already exists." });
    }
    const newUser = await User.create(req.body);
    return res.status(200).json({ user: newUser });
  } catch (err) {
    debug(err);
    return res.status(500).json(err);
  }
}

/**
 * Create a guest-uuid user with a "guest" password.
 *
 * Replies with { user } on success.
 */
async function createGuest(_req, res) {
  try {
    const newUser = await User.create({
      name: "guest-" + uuid.v4(),
      password: "guest",
      isGuest: true
    });

    return res.status(200).json({ user: newUser });
  } catch (err) {
    debug(err);
    return res.status(500).json(err);
  }
}

/**
 * Authenticate the user by name and password.
 * Replies with { token } on success.
 */
async function login(req, res) {
  try {
    const user = await User.findOne({ name: req.body.name });

    if (user) {
      if (await user.comparePassword(req.body.password)) {
        const token = user.generateToken();
        return res.status(200).json({ "token": token });
      } else {
        return res.status(401).json({ "message": "Invalid password." });
      }
    } else {
      return res.status(400).json({ "message": "User not found." });
    }
  } catch (err) {
    debug(err);
    return res.status(500).json(err);
  }
}

/* ------------------------------------------
 * Authentication required for the following:
 * ------------------------------------------ */

/**
 * Delete req.params.id user
 *
 * Replies with { user } on success.
 */
async function _delete(req, res) {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ "message": "User does not exist." });
    }

    // Only allow deletion of authenticated user
    if (String(req.user._id) === String(user._id)) {
      const result = await User.deleteOne(user);
      return res.status(200).json(result);
    } else {
      return res.status(403).json({ "message": "You can only delete yourself." });
    }

  } catch (err) {
    debug(err);
    return res.status(500).json(err);
  }
}

/**
 * Check if a token is valid. This simply runs after the authentication middleware.
 *
 * Replies with a code 200 + { message } on success.
 */
function verify(req, res) {
  res.status(200).json({ message: "Token is valid for user: " + req.user.name });
}

module.exports = {
  create,
  createGuest,
  login,
  verify,
  delete: _delete,
}
