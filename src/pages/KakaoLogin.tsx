import { Suspense, useEffect, useState } from "react";
import {
  useLoaderData,
  useNavigate,
  redirect,
  defer,
  Await,
  useAsyncValue,
  Navigate,
} from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { signInWithCustomToken } from "firebase/auth";
import { db, auth } from "../config";
import { AuthResponse, User } from "../@types";
import { authKakao } from "../common/apis";

import Layout from "../components/Layout";
import { Big } from "../components/Spinner";

const getUser = async (id: string): Promise<User | null> => {
  try {
    const docSnap = await getDoc(doc(db, "users", id));
    const user = docSnap.data() as User;
    return user;
  } catch (error) {
    return null;
  }
};

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
  useEffect(() => {
    const login = async (token: string): Promise<void> => {
      try {
        await signInWithCustomToken(auth, token);
      } catch (error) {}
    };

    login(token);
  }, []);

  return <div>login...</div>;
};

const Auth = () => {
  const res = useAsyncValue() as AuthResponse;
  const auth = res.data;

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const wrapper = async () => {
      try {
        const userId = auth.user.id;
        const user = await getUser(userId);
        setIsLoading(false);
        setUser(user);
      } catch (error) {
        navigate("/login");
      }
    };

    wrapper();
  }, []);

  if (isLoading) {
    return (
      <div>
        <Big />
      </div>
    );
  }

  return user ? (
    <LoginCallback token={auth.firebaseToken} />
  ) : (
    <Navigate to="/signup" state={auth} />
  );
};

const KakaoLogin = () => {
  const data: any = useLoaderData();

  return (
    <Layout>
      <Suspense
        fallback={
          <p>
            <Big />
          </p>
        }
      >
        <Await resolve={data.auth} errorElement={<p>Error!</p>}>
          <Auth />
        </Await>
      </Suspense>
    </Layout>
  );
};

export default KakaoLogin;
