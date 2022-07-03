import { NOTIFICATION_TYPES } from './../types/notificationTypes';

const notificationReducer = (state = [], action) => {
  switch (action.type) {
    case NOTIFICATION_TYPES.GET_ALL_NOTIFICATIONS:
      return action.payload.reverse();
    case NOTIFICATION_TYPES.CREATE_NOTIFICATION:
      return [
        {
          _id: action.payload._id,
          title: action.payload.title,
          description: action.payload.description,
          author: { name: action.payload.authorName },
          link: action.payload.link ? action.payload.link : '',
          isRead: false,
        },
        ...state,
      ];
    case NOTIFICATION_TYPES.READ_NOTIFICATION:
      return state.map((item) =>
        item._id === action.payload ? { ...item, isRead: true } : item
      );
    default:
      return state;
  }
};

export default notificationReducer;
