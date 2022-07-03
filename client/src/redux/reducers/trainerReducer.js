import { CLASS_TYPES } from '../types/classTypes';

const initialState = {
  data: [],
  totalPage: 1,
};

const trainerReducer = (state = initialState, action) => {
  switch (action.type) {
    case CLASS_TYPES.CREATE_CLASS:
      return {
        ...state,
        data: [action.payload, ...state.data],
      };
    case CLASS_TYPES.GET_CLASSES:
      return {
        ...state,
        data: action.payload.classes,
        totalPage: action.payload.totalPage,
      };
    case CLASS_TYPES.FIRED_STUDENT:
      return {
        ...state,
        data: state.data.map((item) =>
          item._id === action.payload.classId
            ? {
                ...item,
                people: item.people.filter(
                  (student) => student._id !== action.payload.studentId
                ),
              }
            : item
        ),
      };
    default:
      return state;
  }
};

export default trainerReducer;
