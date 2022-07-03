import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GLOBAL_TYPES } from './../../redux/types/globalTypes';
import { updateProfile } from './../../redux/actions/authActions';
import { AiOutlineClose } from 'react-icons/ai';
import Avatar from './Avatar';
import Loader from './Loader';

const EditProfile = ({ openEditProfile, setOpenEditProfile }) => {
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    gender: '',
  });
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData.name)
      return dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          errors: "Name field can't be empty.",
        },
      });
    if (!userData.phone)
      return dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          errors: "Phone number field can't be empty.",
        },
      });
    setLoading(true);
    await dispatch(updateProfile(userData, avatar, auth.accessToken));
    setLoading(false);
    setOpenEditProfile(false);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleChangeAvatar = (e) => {
    const file = e.target.files[0];
    if (file.size > 1024 * 1024 * 5) {
      return dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          errors: 'Avatar size should less than 5MB.',
        },
      });
    }
    if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
      return dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          errors: 'Avatar type should be in PNG or JPEG format.',
        },
      });
    }
    setAvatar(file);
  };

  useEffect(() => {
    setUserData({
      name: auth.user?.name,
      phone: auth.user?.phone,
      gender: auth.user?.gender,
    });

    return () => setUserData({ name: '', phone: '', gender: '' });
  }, [auth.user]);
  return (
    <div className={`editProfile ${openEditProfile ? 'active' : undefined}`}>
      <div
        className={`editProfile__box ${openEditProfile ? 'active' : undefined}`}
      >
        <div className="editProfile__header">
          <h3>Edit Profile</h3>
          <AiOutlineClose onClick={() => setOpenEditProfile(false)} />
        </div>
        <div className="editProfile__body">
          <form onSubmit={handleSubmit}>
            <div className="inputGroup--flex">
              <Avatar
                src={avatar ? URL.createObjectURL(avatar) : auth.user?.avatar}
                alt={auth.user?.name}
              />
              <div className="inputGroup">
                <label htmlFor="avatar">Avatar</label>
                <input
                  type="file"
                  id="avatar"
                  name="avatar"
                  accept="image/*"
                  onChange={handleChangeAvatar}
                />
              </div>
            </div>
            <div className="inputGroup">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                autoComplete="off"
                defaultValue={auth.user?.name}
                onChange={handleChange}
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="email">Email address</label>
              <input
                type="text"
                id="email"
                name="email"
                disabled
                defaultValue={auth.user?.email}
                autoComplete="off"
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="phone">Phone number</label>
              <input
                type="number"
                id="phone"
                name="phone"
                autoComplete="off"
                defaultValue={auth.user?.phone.substring(1)}
                onChange={handleChange}
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="gender">Gender</label>
              <div style={{ display: 'flex', marginTop: '10px' }}>
                <div
                  className="inputGroup--answer"
                  style={{ marginRight: '60px' }}
                >
                  <input
                    style={{ marginRight: '8px' }}
                    type="radio"
                    id="male"
                    name="gender"
                    value="male"
                    checked={
                      auth.user?.gender === 'male' || userData.gender === 'male'
                        ? true
                        : false
                    }
                    onChange={handleChange}
                  />
                  <label htmlFor="male">Male</label>
                </div>
                <div className="inputGroup--answer">
                  <input
                    style={{ marginRight: '8px' }}
                    type="radio"
                    id="female"
                    name="gender"
                    value="female"
                    checked={
                      auth.user?.gender === 'female' ||
                      userData.gender === 'female'
                        ? true
                        : false
                    }
                    onChange={handleChange}
                  />
                  <label htmlFor="female">Female</label>
                </div>
              </div>
            </div>
            <button type="submit" disabled={loading ? true : false}>
              {loading ? (
                <div className="center">
                  <Loader width="20px" height="20px" border="2px" />
                </div>
              ) : (
                'Save Changes'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
