const { Notification } = require('./../models/Notification');

const notificationCtrl = {
  getAllNotifications: async (req, res) => {
    try {
      const notifications = await Notification.find({
        user: req.user._id,
      }).populate('data.author', 'name');
      return res.status(200).json({ notifications });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  createNotification: async (req, res) => {
    try {
      const { to, title, description, author, link } = req.body;

      const newNotification = await Notification.findOneAndUpdate(
        { user: to },
        {
          $push: { data: { title, description, author, link } },
        },
        { new: true }
      );

      return res.status(200).json({
        id: newNotification.data[newNotification.data.length - 1]._id,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  readNotification: async (req, res) => {
    try {
      const { id } = req.params;

      await Notification.updateOne(
        { user: req.user.id, 'data._id': id },
        {
          $set: {
            'data.$.isRead': true,
          },
        }
      );

      res.status(200).json({ msg: 'Notification is read.' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = notificationCtrl;
