const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'user',
    },
    data: [
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        author: {
          type: mongoose.Types.ObjectId,
          ref: 'user',
        },
        link: {
          type: String,
          default: '',
        },
        isRead: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model('notification', notificationSchema);
module.exports = { Notification };
