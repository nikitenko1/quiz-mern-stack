const router = require('express').Router();
const notificationCtrl = require('./../controllers/notificationCtrl');
const { isAuthenticated } = require('./../middlewares/auth');

// Express servers receive data from the client side through the req object
// in three instances: the req.params, req.query, and req.body objects
// req.params  '/:userid'
// req.query '/search'
// use the req.body object to receive data through POST and PUT requests in the Express server

router
  .route('/')
  .get(isAuthenticated, notificationCtrl.getAllNotifications)
  .post(isAuthenticated, notificationCtrl.createNotification);

router.route('/:id').patch(isAuthenticated, notificationCtrl.readNotification);

module.exports = router;
