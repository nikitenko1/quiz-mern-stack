import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { GLOBAL_TYPES } from './../redux/types/globalTypes';
import { forgetPassword } from './../redux/actions/authActions';
import Loader from './../components/global/Loader';
import HeadInfo from './../utils/HeadInfo';

const Forget = () => {
  const [email, setEmail] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth, alert } = useSelector((state) => state);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      return dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          errors: "Email field can't be empty.",
        },
      });
    }

    dispatch(forgetPassword(email));
  };

  useEffect(() => {
    if (auth.user) navigate('/');
  }, [auth, navigate]);

  return (
    <>
      <HeadInfo title="Forget Password" />
      <div className="auth">
        <div className="auth__left">
          <img
            src={`${process.env.PUBLIC_URL}/images/ads.jpg`}
            alt="Let's build | Kyiv Login"
          />
        </div>
        <div className="auth__right">
          <h2>Forget Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="inputGroup">
              <label htmlFor="email">Email address</label>
              <input
                type="text"
                id="email"
                name="email"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button type="submit" disabled={alert.loading ? true : false}>
              {alert.loading ? (
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
    </>
  );
};

export default Forget;
