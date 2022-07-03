import { combineReducers } from 'redux';
import alert from './alertReducer';
import auth from './authReducer';
import notification from './notificationReducer';
import instructorClass from './trainerReducer';
import studentClass from './studentReducer';
import socket from './socketReducer';
import quizDetail from './quizDetailReducer';
import category from './categoryReducer';
import submission from './submissionReducer';

export default combineReducers({
  auth,
  alert,
  notification,
  instructorClass,
  studentClass,
  socket,
  quizDetail,
  category,
  submission,
});
