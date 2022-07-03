import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GLOBAL_TYPES } from './../../../redux/types/globalTypes';
import {
  changeRestrictStatus,
  deleteClass,
  renameClass,
  sendBroadcast,
} from './../../../redux/actions/classActions';
import Loader from './../../global/Loader';

const SettingList = ({ id, student, title, status }) => {
  const [name, setName] = useState('');
  const [broadcast, setBroadcast] = useState('');
  const [loadingBroadcast, setLoadingBroadcast] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auth, alert, socket } = useSelector((state) => state);

  const handleRename = (e) => {
    e.preventDefault();
    if (!name) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          errors: "Class name can't be empty.",
        },
      });
    }
    dispatch(renameClass(id, name, auth.accessToken));
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    setLoadingBroadcast(true);
    await dispatch(
      sendBroadcast(
        broadcast,
        student,
        title,
        { id: auth.user?._id, name: auth.user?.name },
        auth.accessToken,
        socket
      )
    );
  };

  const handleCreateQuiz = () => {
    navigate(`/create_quiz/${id}`, { state: { name: id } });
  };

  const handleChangeStatus = () => {
    let newStatus = false;
    if (status === true) {
      newStatus = false;
    } else {
      newStatus = true;
    }
    dispatch(changeRestrictStatus(id, newStatus, auth.accessToken));
  };

  const handleDeleteClass = () => {
    dispatch(deleteClass(id, auth.accessToken));
  };

  return (
    <div className="settingList">
      <div className="restrictGroup">
        <p>Restrict people to join class</p>
        <div
          onClick={handleChangeStatus}
          className={`switchOuter ${status ? 'active' : undefined}`}
        >
          <p>{status ? 'ON' : 'OFF'}</p>
          <div className="switchInner"></div>
        </div>
      </div>
      <form onSubmit={handleRename}>
        <div className="inputGroup">
          <label htmlFor="name">Rename class</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <button type="submit" disabled={alert.loading ? true : false}>
          {alert.loading ? (
            <div className="center">
              <Loader width="20px" height="20px" border="2px" />
            </div>
          ) : (
            'Rename'
          )}
        </button>
      </form>
      <form onSubmit={handleBroadcast}>
        <div className="inputGroup">
          <label htmlFor="broadcast">Broadcast</label>
          <input
            type="text"
            id="broadcast"
            value={broadcast}
            onChange={(e) => setBroadcast(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loadingBroadcast ? true : false}>
          {loadingBroadcast ? (
            <div className="center">
              <Loader width="20px" height="20px" border="2px" />
            </div>
          ) : (
            'Broadcast'
          )}
        </button>
      </form>
      <button onClick={handleCreateQuiz} className="createQuizBtn">
        Create Quiz for "{title}" Class
      </button>
      <button className="deleteBtn" onClick={handleDeleteClass}>
        Delete "{title}" Class
      </button>
    </div>
  );
};

export default SettingList;
