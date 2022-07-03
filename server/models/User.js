const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      default: '',
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default:
        'https://res.cloudinary.com/dvpy1nsjp/image/upload/v1635570881/sample.jpg',
    },
    type: {
      type: String,
      default: 'register',
    },
    rf_token: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('user', userSchema);
module.exports = { User };
