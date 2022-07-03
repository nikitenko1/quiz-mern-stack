import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from './../../redux/actions/authActions';
import { MdLogout } from 'react-icons/md';
import { BsFillKeyFill } from 'react-icons/bs';
import { FaBell, FaUserAlt } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import { GiHamburgerMenu } from 'react-icons/gi';
import { readNotification } from './../../redux/actions/notificationActions';
import Avatar from './Avatar';
import ChangePassword from './ChangePassword';
import EditProfile from './EditProfile';
import JoinClass from './../student/dashboard/JoinClass';
import CreateClass from './../trainer/dashboard/CreateClass';
import CreateCategory from './../trainer/dashboard/CreateCategory';

const Navbar = () => {
  const [isOpenNavbar, setIsOpenNavbar] = useState(false);
  const [isOpenAvatarDropdown, setIsOpenAvatarDropdown] = useState(false);
  const [openJoinClass, setOpenJoinClass] = useState(false);
  const [openCreateClass, setOpenCreateClass] = useState(false);
  const [openCreateCategory, setOpenCreateCategory] = useState(false);
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);

  const dispatch = useDispatch();
  const { auth, notification } = useSelector((state) => state);

  const handleOpenEditProfile = (e) => {
    e.preventDefault();
    setOpenEditProfile(true);
  };

  const handleOpenChangePassword = (e) => {
    e.preventDefault();
    setOpenChangePassword(true);
  };

  return (
    <>
      <div className="navbar">
        <h2>
          <Link to="/dashboard">Let's build | Kyiv</Link>
        </h2>
        <GiHamburgerMenu onClick={() => setIsOpenNavbar(true)} />
        <div
          className={`navbar__overlay ${isOpenNavbar ? 'active' : undefined}`}
        >
          <div
            className={`navbar__links ${isOpenNavbar ? 'active' : undefined}`}
          >
            <div className="navbar__links--closeIcon">
              <AiOutlineClose onClick={() => setIsOpenNavbar(false)} />
            </div>
            {auth.user?.role === 'Student' && (
              <p onClick={() => setOpenJoinClass(true)}>Join Class</p>
            )}

            {auth.user?.role === 'Instructor' && (
              <p onClick={() => setOpenCreateClass(true)}>Create Class</p>
            )}

            {auth.user?.role === 'Instructor' && (
              <p onClick={() => setOpenCreateCategory(true)}>Create Category</p>
            )}
            <div className="navbar__links--notification">
              <div className="navbar__links--notificationIcon">
                <FaBell
                  onClick={() => setOpenNotification(!openNotification)}
                />
                <div>
                  {notification.reduce(
                    (total, item) =>
                      item.isRead === false ? total + 1 : total + 0,
                    0
                  )}
                </div>
              </div>
              <div
                className={`navbar__links--notificationDropdown ${
                  openNotification ? 'active' : undefined
                }`}
              >
                {notification.map((item) => (
                  <Link
                    to={item.link ? item.link : '/'}
                    key={item._id}
                    onClick={() =>
                      dispatch(readNotification(item._id, auth.accessToken))
                    }
                  >
                    <div className="navbar__links--notificationContent">
                      <div>
                        <h4>{item.title}</h4>
                        <p>{item.description}</p>
                        <p>By: {item.author.name}</p>
                      </div>
                      {!item.isRead && <div className="circle" />}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="navbar__links--profile">
              <Avatar
                src={auth.user?.avatar}
                alt={auth.user?.name}
                onClick={() => setIsOpenAvatarDropdown(!isOpenAvatarDropdown)}
              />
              <div
                className={`navbar__links--profileDropdown ${
                  isOpenAvatarDropdown ? 'active' : undefined
                }`}
              >
                <Link to="/" onClick={handleOpenEditProfile}>
                  <FaUserAlt />
                  Edit Profile
                </Link>
                {auth.user?.type === 'register' && (
                  <Link to="/" onClick={handleOpenChangePassword}>
                    <BsFillKeyFill />
                    Change Password
                  </Link>
                )}
                <Link to="/" onClick={() => dispatch(logout(auth.accessToken))}>
                  <MdLogout />
                  Logout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChangePassword
        openChangePassword={openChangePassword}
        setOpenChangePassword={setOpenChangePassword}
      />
      <EditProfile
        openEditProfile={openEditProfile}
        setOpenEditProfile={setOpenEditProfile}
      />
      <JoinClass
        openJoinClass={openJoinClass}
        setOpenJoinClass={setOpenJoinClass}
      />

      <CreateClass
        openCreateClass={openCreateClass}
        setOpenCreateClass={setOpenCreateClass}
      />

      <CreateCategory
        openCreateCategory={openCreateCategory}
        setOpenCreateCategory={setOpenCreateCategory}
      />
    </>
  );
};

export default Navbar;
