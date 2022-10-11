import { redirect } from "react-router-dom";
import { httpsCallable } from "firebase/functions";
import { functions } from "../config";

export const kakaoLoader = async () => {
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get("code");
  const onLoginWithKakao = httpsCallable(functions, "onLoginWithKakao");
  try {
    const res = await onLoginWithKakao({ code });
    console.log(res);
  } catch (error) {
    return redirect("/");
  }
};

const KakaoLogin = () => {
  return <div></div>;
};

export default KakaoLogin;
