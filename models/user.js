const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = process.env.SALT_ROUNDS || 10;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "24h";
const SECRET = process.env.SECRET;

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  isGuest: {
    type: Boolean,
    default: false,
    required: true,
  },
}, {
  toJSON: {
    transform: function (_doc, ret) {
      delete ret.password;
      delete ret.__v;
    }
  }
});

UserSchema.pre("save", function(next) {
  const user = this;
  if(!user.isModified('password')) return next()

  bcrypt.hash(user.password, SALT_ROUNDS, function(err, hash) {
    if (err) return next(err);

    user.password = hash;
    next();
  });
});

UserSchema.methods.comparePassword = async function(password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    return err;
  };
};

UserSchema.methods.generateToken = function() {
  const user = this; //TODO remove password field from the token
  return jwt.sign({ user }, SECRET, { expiresIn: JWT_EXPIRATION });
};

module.exports = mongoose.model("User", UserSchema);
