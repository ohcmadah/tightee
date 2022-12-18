import { Navigate } from "react-router-dom";
import { signInWithCustomToken } from "firebase/auth";
import { auth as firebaseAuth } from "../config";
import { authKakao } from "../common/apis";
import { useAuthState } from "../contexts/AuthContext";

import Loading from "../components/Loading";
import useAsyncAPI from "../hooks/useAsyncAPI";
import Error from "../components/Error";
import Layout from "../components/Layout";

const authorize = async (code: string) => {
  const { data } = await authKakao(code);

  if (data.isJoined) {
    await signInWithCustomToken(firebaseAuth, data.firebaseToken);
    return { isLoggedIn: true, auth: data };
  }

  return { isLoggedIn: false, auth: data };
};

const KakaoLogin = () => {
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get("code");
  const questionId = searchParams.get("state");

  if (!code) {
    return <Navigate to="/login" />;
  }

  const auth = useAsyncAPI(authorize, code);

  switch (auth.state) {
    case "loading":
      return <Loading.Full />;

    case "error":
      return (
        <Layout>
          <Error.Default />
        </Layout>
      );

    case "loaded":
      if (auth.data.isLoggedIn) {
        return questionId ? (
          <Navigate to={"/question/" + questionId} replace />
        ) : (
          <Navigate to="/" replace />
        );
      } else {
        return (
          <Navigate to="/signup" state={{ auth: auth.data.auth, questionId }} />
        );
      }
  }
};

export default KakaoLogin;
