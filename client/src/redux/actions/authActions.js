import { GLOBAL_TYPES } from './../types/globalTypes';
import { getDataAPI, patchDataAPI, postDataAPI } from './../../utils/fetchData';
import { uploadImage } from './../../utils/imageHelper';
import { checkTokenExp } from './../../utils/checkTokenExp';

export const register = (userData) => async (dispatch) => {
  try {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: {
        loading: true,
      },
    });

    const res = await postDataAPI('auth/register', userData);
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

export const login = (userData) => async (dispatch) => {
  try {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: {
        loading: true,
      },
    });

    const res = await postDataAPI('auth/login', userData);
    localStorage.setItem('islogged-ua', true);
    dispatch({
      type: GLOBAL_TYPES.AUTH,
      payload: {
        user: res.data.user,
        accessToken: res.data.accessToken,
      },
    });

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

export const refreshToken = () => async (dispatch) => {
  try {
    const logged = localStorage.getItem('islogged-ua');

    if (logged) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          loading: true,
        },
      });

      const res = await getDataAPI('auth/refresh_token');
      dispatch({
        type: GLOBAL_TYPES.AUTH,
        payload: {
          user: res.data.user,
          accessToken: res.data.accessToken,
        },
      });

      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {},
      });
    }
  } catch (err) {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: {
        errors: err.response.data.msg,
      },
    });
  }
};

export const logout = (accessToken) => async (dispatch) => {
  try {
    const tokenExp = await checkTokenExp(accessToken, dispatch);
    const access_token = tokenExp ? tokenExp : accessToken;

    const res = await getDataAPI('auth/logout', access_token);
    localStorage.removeItem('islogged-ua');
    dispatch({
      type: GLOBAL_TYPES.AUTH,
      payload: {},
    });

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

export const googleLogin = (id_token) => async (dispatch) => {
  try {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: {
        loading: true,
      },
    });

    const res = await postDataAPI('auth/google_login', { token: id_token });
    localStorage.setItem('islogged-ua', true);
    dispatch({
      type: GLOBAL_TYPES.AUTH,
      payload: {
        user: res.data.user,
        accessToken: res.data.accessToken,
      },
    });

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

export const updateProfile =
  (userData, avatar, accessToken) => async (dispatch) => {
    try {
      const tokenExp = await checkTokenExp(accessToken, dispatch);
      const access_token = tokenExp ? tokenExp : accessToken;

      const data = {
        ...userData,
      };

      let img_url = '';
      if (avatar) {
        const imgResult = await uploadImage(avatar);
        img_url = imgResult.secure_url;
        data.avatar = img_url;
      }

      const res = await patchDataAPI('auth/edit', data, access_token);
      dispatch({
        type: GLOBAL_TYPES.AUTH,
        payload: {
          user: res.data.user,
          accessToken,
        },
      });

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

export const changePassword =
  (passwordData, accessToken) => async (dispatch) => {
    try {
      const tokenExp = await checkTokenExp(accessToken, dispatch);
      const access_token = tokenExp ? tokenExp : accessToken;

      const res = await patchDataAPI(
        'auth/change_password',
        passwordData,
        access_token
      );
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

export const forgetPassword = (email) => async (dispatch) => {
  try {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: {
        loading: true,
      },
    });

    const res = await postDataAPI('auth/forget_password', { email });
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

export const resetPassword = (password, token) => async (dispatch) => {
  try {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: {
        loading: true,
      },
    });

    const res = await patchDataAPI('auth/reset_password', { password, token });
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
