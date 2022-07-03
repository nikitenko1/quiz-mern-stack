const router = require('express').Router();
const categoryCtrl = require('./../controllers/categoryCtrl');
const { isAuthenticated } = require('./../middlewares/auth');

router
  .route('/')
  .get(categoryCtrl.getCategory)
  .post(isAuthenticated, categoryCtrl.createCategory);

module.exports = router;
