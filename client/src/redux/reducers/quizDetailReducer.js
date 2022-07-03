import { QUIZ_TYPES } from './../types/quizTypes';

const quizDetailReducer = (state = {}, action) => {
  switch (action.type) {
    case QUIZ_TYPES.GET_QUIZ_DETAIL:
      return action.payload;
    default:
      return state;
  }
};

export default quizDetailReducer;
