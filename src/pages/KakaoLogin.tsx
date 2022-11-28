import { Navigate } from "react-router-dom";
import { signInWithCustomToken } from "firebase/auth";
import { auth as firebaseAuth } from "../config";
import { authKakao, getUser } from "../common/apis";

import Loading from "../components/Loading";
import useAsyncAPI from "../hooks/useAsyncAPI";
import Error from "../components/Error";
import Layout from "../components/Layout";
import withAuth from "../hocs/withAuth";

const authorize = async (code: string) => {
  const { data } = await authKakao(code);
  const user = await getUser(data.kakaoUser.id);

  if (user.exists()) {
    await signInWithCustomToken(firebaseAuth, data.firebaseToken);
    return { isLoggedIn: true, auth: data };
  }

  return { isLoggedIn: false, auth: data };
};

const KakaoLogin = () => {
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get("code");

  if (!code) {
    return <Navigate to="/login" />;
  }

  const auth = useAsyncAPI(authorize, code);

  switch (auth.state) {
    case "loading":
      return <Loading.Full />;

    case "error":
      return (
        <Layout className="pt-12">
          <Error.Default />
        </Layout>
      );

    case "loaded":
      if (auth.data.isLoggedIn) {
        return <Navigate to="/" replace />;
      } else {
        return <Navigate to="/signup" state={auth.data.auth} />;
      }
  }
};

export default withAuth(KakaoLogin, "guest");
