import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { signInWithCustomToken } from "firebase/auth";
import { auth as firebaseAuth } from "../config";
import { Auth } from "../@types";
import { authKakao, getUser } from "../common/apis";

import Layout from "../components/Layout";
import Loading from "../components/Loading";

const KakaoLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [auth, setAuth] = useState<Auth | null>(null);

  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get("code");

  if (!code) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    (async () => {
      try {
        const res = await authKakao(code);
        const {
          kakaoUser: { id },
          firebaseToken,
        } = res.data;

        const user = await getUser(id);

        if (user.exists()) {
          await signInWithCustomToken(firebaseAuth, firebaseToken);
        } else {
          setAuth(res.data);
        }

        setIsLoading(false);
      } catch (error) {}
    })();
  }, []);

  if (isLoading) {
    return <Loading.Full />;
  }

  return (
    <Layout>
      {auth ? (
        <Navigate to="/signup" state={auth} />
      ) : (
        <Navigate to="/" replace />
      )}
    </Layout>
  );
};

export default KakaoLogin;
