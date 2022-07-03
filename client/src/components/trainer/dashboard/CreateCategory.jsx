import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';
import { GLOBAL_TYPES } from '../../../redux/types/globalTypes';
import { createCategory } from '../../../redux/actions/categoryActions';
import Loader from '../../global/Loader';

const CreateCategory = ({ openCreateCategory, setOpenCreateCategory }) => {
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState({
    name: '',
  });
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData({ ...categoryData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryData.name) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          errors: 'Please provide every field.',
        },
      });
    }

    setLoading(true);
    await dispatch(createCategory(categoryData, auth.accessToken));
    setLoading(false);
    setOpenCreateCategory(false);
  };

  return (
    <div className={`createClass ${openCreateCategory ? 'active' : undefined}`}>
      <div
        className={`createClass__box ${
          openCreateCategory ? 'active' : undefined
        }`}
      >
        <div className="createClass__header">
          <h3>Create Category</h3>
          <AiOutlineClose onClick={() => setOpenCreateCategory(false)} />
        </div>
        <div className="createClass__body">
          <form onSubmit={handleSubmit}>
            <div className="inputGroup">
              <label htmlFor="name">Category Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={categoryData.name}
                onChange={handleChange}
                autoComplete="off"
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

export default CreateCategory;
