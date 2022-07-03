import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';
import { GLOBAL_TYPES } from '../../../redux/types/globalTypes';
import { createClass } from '../../../redux/actions/classActions';
import Loader from '../../global/Loader';

const CreateClass = ({ openCreateClass, setOpenCreateClass }) => {
  const [loading, setLoading] = useState(false);
  const [classData, setClassData] = useState({
    name: '',
    description: '',
  });
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClassData({ ...classData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!classData.name || !classData.description) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          errors: 'Please provide every field.',
        },
      });
    }

    setLoading(true);
    await dispatch(createClass(classData, auth.accessToken));
    setLoading(false);
    setOpenCreateClass(false);
  };

  return (
    <div className={`createClass ${openCreateClass ? 'active' : undefined}`}>
      <div
        className={`createClass__box ${openCreateClass ? 'active' : undefined}`}
      >
        <div className="createClass__header">
          <h3>Create Class</h3>
          <AiOutlineClose onClick={() => setOpenCreateClass(false)} />
        </div>
        <div className="createClass__body">
          <form onSubmit={handleSubmit}>
            <div className="inputGroup">
              <label htmlFor="name">Class Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={classData.name}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="description">Class Description</label>
              <textarea
                id="description"
                name="description"
                value={classData.description}
                onChange={handleChange}
              />
            </div>
            <button type="submit" disabled={loading ? true : false}>
              {loading ? (
                <div className="center">
                  <Loader width="20px" height="20px" border="2px" />
                </div>
              ) : (
                'Submit'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateClass;
