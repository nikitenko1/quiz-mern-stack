const router = require('express').Router();
const quizCtrl = require('./../controllers/quizCtrl');
const { isAuthenticated, authorizeRoles } = require('./../middlewares/auth');

router
  .route('/')
  .post(isAuthenticated, authorizeRoles('Instructor'), quizCtrl.createQuiz);

router
  .route('/:id')
  .get(quizCtrl.getQuizById)
  .patch(isAuthenticated, authorizeRoles('Instructor'), quizCtrl.udpateQuiz)
  .delete(isAuthenticated, authorizeRoles('Instructor'), quizCtrl.deleteQuiz);

router
  .route('/status/:id')
  .patch(
    isAuthenticated,
    authorizeRoles('Instructor'),
    quizCtrl.changeQuizStatus
  );

router
  .route('/submit')
  .post(isAuthenticated, authorizeRoles('Student'), quizCtrl.submitQuiz);

module.exports = router;
