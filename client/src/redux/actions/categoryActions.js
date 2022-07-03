import { GLOBAL_TYPES } from './../types/globalTypes';
import { CATEGORY_TYPES } from './../types/categoryTypes';
import { getDataAPI, postDataAPI } from './../../utils/fetchData';
import { checkTokenExp } from './../../utils/checkTokenExp';

export const createCategory =
  (categoryData, accessToken) => async (dispatch) => {
    try {
      const tokenExp = await checkTokenExp(accessToken, dispatch);
      const access_token = tokenExp ? tokenExp : accessToken;

      const res = await postDataAPI('category', categoryData, access_token);

      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          success: res.data.msg,
        },
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

export const getAllCategory = () => async (dispatch) => {
  try {
    const res = await getDataAPI('category');
    dispatch({
      type: CATEGORY_TYPES.GET_ALL_CATEGORY,
      payload: res.data.categories,
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
