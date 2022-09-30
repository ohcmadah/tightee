import Layout from "../components/Layout";
import kakaoLoginButton from "../assets/kakao_login_large_wide.png";

declare global {
  interface Window {
    Kakao: any;
  }
}

const onLoginWithKakao = () => {
  const redirectUri = `${location.origin}/callback/kakaotalk`;
  window.Kakao.Auth.authorize({
    redirectUri,
    scope: "profile_nickname",
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
