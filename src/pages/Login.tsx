import Layout from "../components/Layout";
import kakaoLoginButton from "../assets/kakao_login_large_wide.png";
import {
  KAKAO_SCOPE_BIRTHDAY,
  KAKAO_SCOPE_GENDER,
  KAKAO_SCOPE_NICKNAME,
  KAKAO_SCOPE_PROFILE_IMAGE,
} from "../common/constants";

declare global {
  interface Window {
    Kakao: any;
  }
}

const onLoginWithKakao = () => {
  const redirectUri = `${location.origin}/callback/kakaotalk`;
  const scope = [
    KAKAO_SCOPE_NICKNAME,
    KAKAO_SCOPE_PROFILE_IMAGE,
    KAKAO_SCOPE_GENDER,
    KAKAO_SCOPE_BIRTHDAY,
  ].join(",");

  window.Kakao.Auth.authorize({
    redirectUri,
    scope,
  });
};

const Login = () => {
  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY);
  }

  return (
    <Layout>
      <h1 className="font-bold text-3xl">Login</h1>
      <button onClick={onLoginWithKakao}>
        <img src={kakaoLoginButton} alt="Login with Kakao" />
      </button>
    </Layout>
  );
};

export default Login;
