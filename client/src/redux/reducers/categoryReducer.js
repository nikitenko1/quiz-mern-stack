import { CATEGORY_TYPES } from './../types/categoryTypes';

const categoryReducer = (state = [], action) => {
  switch (action.type) {
    case CATEGORY_TYPES.CREATE_CATEGORY:
      return {
        ...state,
        data: [action.payload, ...state.data],
      };
    case CATEGORY_TYPES.GET_ALL_CATEGORY:
      return action.payload;
    default:
      return state;
  }
};

export default categoryReducer;
