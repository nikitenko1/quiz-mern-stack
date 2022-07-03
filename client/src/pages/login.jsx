import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { GLOBAL_TYPES } from '../redux/types/globalTypes';
import { checkEmail } from '../utils/formatChecker';
// import SocialLogin from '../components/auth/SocialLogin';
import { login } from '../redux/actions/authActions';
import Loader from './../components/global/Loader';
import HeadInfo from '../utils/HeadInfo';

const Login = () => {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { alert, auth } = useSelector((state) => state);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userData.email || !userData.password)
      return dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          errors: 'Please provide every field',
        },
      });

    if (!checkEmail(userData.email))
      return dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          errors: 'Please provide valid email address.',
        },
      });

    if (userData.password.length < 8)
      return dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          errors: 'Password length should be at least 8 characters.',
        },
      });

    dispatch(login(userData));
  };

  useEffect(() => {
    if (auth.user) navigate('/');
  }, [auth, navigate]);

  return (
    <>
      <HeadInfo title="Login" />
      <div className="auth">
        <div className="auth__left">
          <img
            src={`${process.env.PUBLIC_URL}/images/ads.jpg`}
            alt="Let's build | Kyiv Login"
          />
        </div>
        <div className="auth__right">
          <h2>Sign In To Let&apos;s build | Kyiv</h2>
          {/* <SocialLogin /> */}
          <form onSubmit={handleSubmit}>
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
              <Link style={{ marginTop: '7px', display: 'block' }} to="/forget">
                Forget Password
              </Link>
            </div>
            <button type="submit" disabled={alert.loading ? true : false}>
              {alert.loading ? (
                <div className="center">
                  <Loader width="20px" height="20px" border="2px" />
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          <p>
            Don't have an account yet? Click <Link to="/register">here</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
