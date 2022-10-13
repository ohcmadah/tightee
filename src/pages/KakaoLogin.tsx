import axios from "axios";
import { useEffect } from "react";
import { useLoaderData, useNavigate, redirect } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { signInWithCustomToken } from "firebase/auth";
import { db, auth } from "../config";
import { User } from "../../@types";

import Layout from "../components/Layout";

const getUser = async (id: string): Promise<User | null> => {
  try {
    const docSnap = await getDoc(doc(db, "users", id));
    const user = docSnap.data() as User;
    return user;
  } catch (error) {
    return null;
  }
};

const login = async (token: string): Promise<void> => {
  try {
    await signInWithCustomToken(auth, token);
  } catch (error) {}
};

export const kakaoLoader = async () => {
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get("code");
  try {
    const { data } = await axios.post("/api/auth/kakao", { code });
    const userId = data.user.uid;
    const user = await getUser(userId);
    if (user) {
      const token = data.firebaseToken;
      await login(token);
      redirect("/");
    }
    return data;
  } catch (error) {
    return redirect("/");
  }
};

const KakaoLogin = () => {
  const res = useLoaderData();
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/signup", {
      state: res,
    });
  }, []);

  return <Layout>loading...</Layout>;
};

export default KakaoLogin;
