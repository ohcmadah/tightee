import Layout from "../components/Layout";
import kakaoLoginButton from "../assets/kakao_login_large_wide.png";

const Login = () => {
  return (
    <Layout>
      <h1 className="font-bold text-3xl">Login</h1>
      <button>
        <img src={kakaoLoginButton} alt="Login with Kakao" />
      </button>
    </Layout>
  );
};

export default Login;
