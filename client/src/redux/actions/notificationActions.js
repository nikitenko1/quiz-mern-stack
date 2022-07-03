import { GLOBAL_TYPES } from './../types/globalTypes';
import { NOTIFICATION_TYPES } from './../types/notificationTypes';
import { getDataAPI, patchDataAPI, postDataAPI } from './../../utils/fetchData';
import { checkTokenExp } from './../../utils/checkTokenExp';

export const getNotifications = (accessToken) => async (dispatch) => {
  try {
    const tokenExp = await checkTokenExp(accessToken, dispatch);
    const access_token = tokenExp ? tokenExp : accessToken;

    const res = await getDataAPI('notification', access_token);
    console.log(res.data.notifications[0].data);
    dispatch({
      type: NOTIFICATION_TYPES.GET_ALL_NOTIFICATIONS,
      payload: res.data.notifications[0].data,
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

export const createNotification = (data, accessToken) => async (dispatch) => {
  try {
    const tokenExp = await checkTokenExp(accessToken, dispatch);
    const access_token = tokenExp ? tokenExp : accessToken;

    const notifId = await postDataAPI('notification', data, access_token);
    return notifId.data.id;
  } catch (err) {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: {
        errors: err.response.data.msg,
      },
    });
  }
};

export const readNotification = (id, accessToken) => async (dispatch) => {
  try {
    const tokenExp = await checkTokenExp(accessToken, dispatch);
    const access_token = tokenExp ? tokenExp : accessToken;

    await patchDataAPI(`notification/${id}`, {}, access_token);
    dispatch({
      type: NOTIFICATION_TYPES.READ_NOTIFICATION,
      payload: id,
    });
  } catch (err) {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: {
        errors: err.respponse.data.msg,
      },
    });
  }
};
