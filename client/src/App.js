import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { refreshToken } from './redux/actions/authActions';
import { getNotifications } from './redux/actions/notificationActions';
import { GLOBAL_TYPES } from './redux/types/globalTypes';
import PageRender from './utils/PageRender';
import Login from './pages/login';
import SocketClient from './SocketClient';
import Dashboard from './pages/dashboard';
import io from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  const { alert } = useSelector((state) => state);

  useEffect(() => {
    if (alert.errors) {
      toast.error(alert.errors);
    }
  }, [alert.errors]);

  useEffect(() => {
    if (alert.success) {
      toast.success(alert.success);
    }
  }, [alert.success]);

  useEffect(() => {
    dispatch(refreshToken());

    const socket = io();
    dispatch({ type: GLOBAL_TYPES.SOCKET, payload: socket });
    return () => socket.close();
  }, [dispatch]);

  useEffect(() => {
    if (auth.accessToken) dispatch(getNotifications(auth.accessToken));
  }, [dispatch, auth.accessToken]);

  useEffect(() => {
    // Let's check if the browser supports notifications
    if (!('Notification' in window)) {
      toast.warn('This browser does not support desktop notification');
    }
    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === 'granted') {
    }
    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === 'granted') {
        }
      });
    }
    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them any more.
  }, []);

  return (
    <Router>
      {auth.accessToken && <SocketClient />}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
      />
      {/* Same as */}
      <ToastContainer />
      <Routes>
        <Route path="/" element={auth.user ? <Dashboard /> : <Login />} />
        <Route path="/:page" element={<PageRender />} />
        <Route path="/:page/:id" element={<PageRender />} />
      </Routes>
    </Router>
  );
};

export default App;
