const router = require('express').Router();
const resultCtrl = require('./../controllers/resultCtrl');
const { isAuthenticated, authorizeRoles } = require('./../middlewares/auth');

// Express servers receive data from the client side through the req object
// in three instances: the req.params, req.query, and req.body objects
// req.params  '/:userid'
// req.query '/search'
// use the req.body object to receive data through POST and PUT requests in the Express server
router
  .route('/quiz/:id')
  .get(
    isAuthenticated,
    authorizeRoles('Instructor'),
    resultCtrl.getResultByQuiz
  );

module.exports = router;
