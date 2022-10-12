import { redirect } from "react-router-dom";
import axios from "axios";

export const kakaoLoader = async () => {
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get("code");
  try {
    const res = await axios.post("/api/auth/kakao", { code });
    console.log(res);
  } catch (error) {
    return redirect("/");
  }
};

const KakaoLogin = () => {
  return <div></div>;
};

export default KakaoLogin;
