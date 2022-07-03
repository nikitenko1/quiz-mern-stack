import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NOTIFICATION_TYPES } from './redux/types/notificationTypes';
import { SUBMISSION_TYPES } from './redux/types/submissionTypes';

const spawnNotification = (body, url, title) => {
  let options = {
    body,
  };

  let n = new Notification(title, options);
  n.onClick = (e) => {
    e.preventDefault();
    window.open(url, '_blank');
  };
};

const SocketClient = () => {
  const dispatch = useDispatch();
  const { auth, socket } = useSelector((state) => state);

  useEffect(() => {
    socket.emit('joinUser', auth.user);
  }, [socket, auth.user]);

  useEffect(() => {
    // socket.on(eventName, listener)
    socket.on('sendBroadcastToClient', (data) => {
      dispatch({
        type: NOTIFICATION_TYPES.CREATE_NOTIFICATION,
        payload: data,
      });

      spawnNotification(
        data.title,
        `${process.env.CLIENT_URL}`,
        'Let&apos;s build | Kyiv'
      );
    });

    return () => socket.off('sendBroadcastToClient');
  }, [dispatch, socket]);

  useEffect(() => {
    // socket.on(eventName, listener)
    socket.on('createQuizToClient', (data) => {
      dispatch({
        type: NOTIFICATION_TYPES.CREATE_NOTIFICATION,
        payload: data,
      });

      spawnNotification(
        data.title,
        `${process.env.CLIENT_URL}/${data.link}`,
        'Let&apos;s build | Kyiv'
      );
    });

    return () => socket.off('createQuizToClient');
  }, [dispatch, socket]);

  useEffect(() => {
    socket.on('submitQuizToClient', (data) => {
      dispatch({
        type: NOTIFICATION_TYPES.CREATE_NOTIFICATION,
        payload: data,
      });

      spawnNotification(
        data.title,
        `${process.env.CLIENT_URL}/${data.link}`,
        'Let&apos;s build | Kyiv'
      );
    });

    return () => socket.off('submitQuizToClient');
  }, [dispatch, socket]);

  useEffect(() => {
    socket.on('addSubmissionToClient', (data) => {
      dispatch(
        {
          type: SUBMISSION_TYPES.ADD_SUBMISSION,
          payload: data,
        },
        []
      );
    });

    return () => socket.off('addSubmissionToClient');
  }, [dispatch, socket]);

  return <div></div>;
};

export default SocketClient;
