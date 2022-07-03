import { useDispatch } from 'react-redux';
import { MAILING_SERVICE_CLIENT_ID } from '../../utils/constant';
import { googleLogin } from '../../redux/actions/authActions';
import GoogleLogin from 'react-google-login';

const SocialLogin = () => {
  const dispatch = useDispatch();

  const onSuccess = (response) => {
    const { id_token } = response.getAuthResponse();
    dispatch(googleLogin(id_token));
  };
  const responseGoogle = (response) => {
    console.log(response);
  };
  // https://developers.google.com/identity/sign-in/web/reference
  // We are discontinuing the Google Sign-In JavaScript Platform Library for web.
  // The library will be unavailable for download after the March 31, 2023 deprecation date.
  // Instead, use the new Google Identity Services for Web.
  return (
    <>
      <div style={{ marginBottom: '25px', backgroundColor: '#cbe2ef' }}>
        <GoogleLogin
          clientId={MAILING_SERVICE_CLIENT_ID}
          buttonText="Login"
          // plugin_name="YOUR_STRING_HERE"
          plugin_name="streamy"
          onSuccess={onSuccess}
          onFailure={responseGoogle}
          cookiePolicy={'single_host_origin'}
        />
      </div>
    </>
  );
};

export default SocialLogin;
