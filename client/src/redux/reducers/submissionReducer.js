import { SUBMISSION_TYPES } from './../types/submissionTypes';

const submissionReducer = (state = {}, action) => {
  switch (action.type) {
    case SUBMISSION_TYPES.GET_SUBMISSIONS_BY_QUIZ:
      return action.payload;
    case SUBMISSION_TYPES.ADD_SUBMISSION:
      return {
        ...state,
        results:
          action.payload.quizId === state._id
            ? [action.payload, ...state.results]
            : state.results,
        count:
          action.payload.quizId === state._id ? state.count + 1 : state.count,
      };
    default:
      return state;
  }
};

export default submissionReducer;
