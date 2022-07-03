import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';
import Loader from './../../global/Loader';
import { GLOBAL_TYPES } from './../../../redux/types/globalTypes';
import { joinClass } from './../../../redux/actions/classActions';

const JoinClass = ({ openJoinClass, setOpenJoinClass }) => {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');

  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code) {
      return dispatch({
        type: GLOBAL_TYPES,
        payload: {
          errors: "Class code can't be empty.",
        },
      });
    }

    setLoading(true);
    await dispatch(joinClass(code, auth.accessToken));
    setLoading(false);
    setCode('');
    setOpenJoinClass(false);
  };
  return (
    <div className={`joinClass ${openJoinClass ? 'active' : undefined}`}>
      <div className={`joinClass__box ${openJoinClass ? 'active' : undefined}`}>
        <div className="joinClass__header">
          <h3>Join Class</h3>
          <AiOutlineClose onClick={() => setOpenJoinClass(false)} />
        </div>
        <div className="joinClass__body">
          <form onSubmit={handleSubmit}>
            <div className="inputGroup">
              <label htmlFor="code">Class Code</label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                autoComplete="off"
              />
            </div>
            <button type="submit" disabled={loading ? true : false}>
              {loading ? (
                <div className="center">
                  <Loader width="20px" height="20px" border="2px" />
                </div>
              ) : (
                'Join Class'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinClass;
