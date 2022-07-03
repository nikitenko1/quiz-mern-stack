const router = require('express').Router();
const classCtrl = require('../controllers/classCtrl.js');
const { isAuthenticated, authorizeRoles } = require('./../middlewares/auth');

// Express servers receive data from the client side through the req object
// in three instances: the req.params, req.query, and req.body objects
// req.params  '/:userid'
// req.query '/search'
// use the req.body object to receive data through POST and PUT requests in the Express server

router
  .route('/')
  .get(
    isAuthenticated,
    authorizeRoles('Instructor'),
    classCtrl.getClassesByInstructor
  )
  .post(isAuthenticated, authorizeRoles('Instructor'), classCtrl.createClass);

router
  .route('/student')
  .get(isAuthenticated, authorizeRoles('Student'), classCtrl.getStudentClasses);

router
  .route('/:id')
  .get(classCtrl.getClassDetail)
  .delete(isAuthenticated, authorizeRoles('Instructor'), classCtrl.deleteClass);

router
  .route('/restrict/:id')
  .patch(
    isAuthenticated,
    authorizeRoles('Instructor'),
    classCtrl.changeRestrictStatus
  );
router
  .route('/rename/:id')
  .patch(isAuthenticated, authorizeRoles('Instructor'), classCtrl.renameClass);
router
  .route('/join/:id')
  .patch(isAuthenticated, authorizeRoles('Student'), classCtrl.joinClass);
router
  .route('/fired/:id')
  .patch(isAuthenticated, authorizeRoles('Instructor'), classCtrl.firedStudent);

router.route('/search/instructor/:id').get(classCtrl.searchInstructorClass);
router
  .route('/search/student')
  .get(isAuthenticated, classCtrl.searchStudentClass);

module.exports = router;
