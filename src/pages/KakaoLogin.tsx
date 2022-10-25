import { Suspense, useEffect } from "react";
import {
  useLoaderData,
  redirect,
  defer,
  Await,
  useAsyncValue,
  Navigate,
} from "react-router-dom";
import { auth } from "../config";
import { AuthResponse } from "../@types";
import { authKakao } from "../common/apis";
import { signInWithCustomToken } from "firebase/auth";
import { useAuthState } from "../contexts/AuthContext";

import Layout from "../components/Layout";
import Spinner from "../components/Spinner";

export const kakaoLoader = async () => {
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get("code");
  if (!code) {
    return redirect("/");
  }
  const authKakaoPromise = authKakao(code);
  return defer({ auth: authKakaoPromise });
};

type LoginCallbackProps = {
  token: string;
};

const LoginCallback = ({ token }: LoginCallbackProps) => {
  const { user } = useAuthState();

  useEffect(() => {
    const login = async (token: string): Promise<void> => {
      try {
        await signInWithCustomToken(auth, token);
      } catch (error) {}
    };

    login(token);
  }, []);

  return user ? <Navigate to="/" replace /> : <div>login...</div>;
};

const Login = () => {
  const { data } = useAsyncValue() as AuthResponse;
  const { user, firebaseToken } = data;

  return user ? (
    <LoginCallback token={firebaseToken} />
  ) : (
    <Navigate to="/signup" state={data} />
  );
};

const KakaoLogin = () => {
  const data: any = useLoaderData();

  return (
    <Layout>
      <Suspense fallback={<Spinner.Big />}>
        <Await resolve={data.auth} errorElement={<p>Error!</p>}>
          <Login />
        </Await>
      </Suspense>
    </Layout>
  );
};

export default KakaoLogin;
