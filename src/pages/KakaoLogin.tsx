import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { signInWithCustomToken } from "firebase/auth";
import { auth as firebaseAuth } from "../config";
import { AuthResponse } from "../@types";
import { authKakao } from "../common/apis";

import Layout from "../components/Layout";
import Spinner from "../components/Spinner";

const Loading = () => (
  <div className="flex h-[100vh] w-full items-center justify-center">
    <Spinner.Big />
  </div>
);

const KakaoLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [auth, setAuth] = useState<AuthResponse["data"] | null>(null);

  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get("code");

  if (!code) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    (async () => {
      try {
        const res = await authKakao(code);
        const { user, firebaseToken } = res.data;

        if (user) {
          await signInWithCustomToken(firebaseAuth, firebaseToken);
        } else {
          setAuth(res.data);
        }

        setIsLoading(false);
      } catch (error) {}
    })();
  }, []);

  if (isLoading) {
    return <Loading />;
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
