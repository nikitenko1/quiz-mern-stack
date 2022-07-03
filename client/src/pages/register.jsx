import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { BsPlus } from 'react-icons/bs';
import { GLOBAL_TYPES } from '../redux/types/globalTypes';
import { register } from '../redux/actions/authActions';
import { checkEmail, checkPhone } from '../utils/formatChecker';
import RoleModal from '../components/auth/RoleModal';
import HeadInfo from '../utils/HeadInfo';

const Register = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [onChooseRole, setOnChooseRole] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleChangeRole = (role) => {
    setUserData({ ...userData, role });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setOnChooseRole(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !userData.name ||
      !userData.email ||
      !userData.phone ||
      !userData.password ||
      !userData.confirmPassword ||
      !userData.role
    )
      return dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          errors: 'Please provide every field.',
        },
      });

    if (userData.password.length < 8)
      return dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          errors: 'Password length should be at least 8 characters.',
        },
      });

    if (userData.password !== userData.confirmPassword)
      return dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          errors: "Password confirmation doesn't match.",
        },
      });

    if (!checkEmail(userData.email))
      return dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          errors: 'Please provide a valid email.',
        },
      });

    if (!checkPhone(`+${userData.phone}`))
      return dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          errors: 'Please provide a valid phone.',
        },
      });

    await dispatch(register({ ...userData, phone: `+${userData.phone}` }));
    setOnChooseRole(false);
  };

  useEffect(() => {
    if (auth.user) navigate('/');
  }, [auth, navigate]);

  return (
    <>
      <HeadInfo title="Register" />
      <div className="auth">
        <div className="auth__left">
          <img
            src={`${process.env.PUBLIC_URL}/images/ads.jpg`}
            alt="Let's build | Kyiv Register"
          />
        </div>
        <div className="auth__right">
          <h2>Sign Up Let&apos;s build | Kyiv</h2>
          <form onSubmit={handleNextStep}>
            <div className="inputGroup">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={userData.name}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="email">Email address</label>
              <input
                type="text"
                name="email"
                id="email"
                value={userData.email}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="phone">Phone number</label>
              <div className="inputGroup--phone">
                <div>
                  <BsPlus />
                </div>
                <input
                  type="number"
                  name="phone"
                  id="phone"
                  value={userData.phone}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="inputGroup">
              <label htmlFor="password">Password</label>
              <div className="inputGroup--password">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  value={userData.password}
                  onChange={handleChange}
                />
                {showPassword ? (
                  <FaEyeSlash onClick={() => setShowPassword(false)} />
                ) : (
                  <FaEye onClick={() => setShowPassword(true)} />
                )}
              </div>
            </div>
            <div className="inputGroup">
              <label htmlFor="password">Confirm Password</label>
              <div className="inputGroup--password">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  id="confirmPassword"
                  value={userData.confirmPassword}
                  onChange={handleChange}
                />
                {showConfirmPassword ? (
                  <FaEyeSlash onClick={() => setShowConfirmPassword(false)} />
                ) : (
                  <FaEye onClick={() => setShowConfirmPassword(true)} />
                )}
              </div>
            </div>
            <button>Next</button>
          </form>
          <p>
            Already have an account? Click <Link to="/login">here</Link>
          </p>
        </div>
      </div>

      <RoleModal
        cb={handleChangeRole}
        currentRole={userData.role}
        onChooseRole={onChooseRole}
        setOnChooseRole={setOnChooseRole}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default Register;
