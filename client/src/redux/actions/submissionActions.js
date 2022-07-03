import { GLOBAL_TYPES } from './../types/globalTypes';
import { SUBMISSION_TYPES } from './../types/submissionTypes';
import { getDataAPI } from './../../utils/fetchData';
import { checkTokenExp } from './../../utils/checkTokenExp';

export const getSubmissionsByQuiz =
  (quizId, accessToken) => async (dispatch) => {
    try {
      const tokenExp = await checkTokenExp(accessToken, dispatch);
      const access_token = tokenExp ? tokenExp : accessToken;

      const res = await getDataAPI(`result/quiz/${quizId}`, access_token);
      dispatch({
        type: SUBMISSION_TYPES.GET_SUBMISSIONS_BY_QUIZ,
        payload: res.data.submissions,
      });
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          errors: err.response.data.msg,
        },
      });
    }
  };
