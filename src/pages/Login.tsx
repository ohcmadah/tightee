import {
  KAKAO_SCOPE_BIRTHDAY,
  KAKAO_SCOPE_GENDER,
  KAKAO_SCOPE_NICKNAME,
  URL_CS,
} from "../common/constants";

import Layout from "../components/Layout";
import withAuth from "../hocs/withAuth";

import kakaoSymbol from "../assets/kakao.svg";
import tightee from "../../public/tightee.svg";
import home from "../assets/home.png";

declare global {
  interface Window {
    Kakao: any;
  }
}

const onLoginWithKakao = () => {
  const redirectUri = `${location.origin}/callback/kakaotalk`;
  const scope = [
    KAKAO_SCOPE_NICKNAME,
    KAKAO_SCOPE_GENDER,
    KAKAO_SCOPE_BIRTHDAY,
  ].join(",");

  window.Kakao.Auth.authorize({
    redirectUri,
    scope,
  });
};

const Login = () => {
  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(process.env.VITE_KAKAO_JAVASCRIPT_KEY);
  }

  return (
    <Layout className="flex h-[100vh] flex-col items-center justify-center px-10">
      <h1>
        <img src={tightee} alt="Tightee" />
      </h1>
      <h2 className="mt-1.5 select-none text-base font-bold text-grayscale-60">
        전국민 MBTI 검증 프로젝트
      </h2>
      <div className="mt-6 w-full select-none rounded-full bg-primary-peach py-2.5 text-center text-base font-bold text-grayscale-80 drop-shadow-md">
        세상에 나와 비슷한 사람이 얼마나 있을까요?
      </div>
      <button
        className="mt-16 flex h-12 w-full items-center justify-between rounded-md bg-kakao-container px-4 text-base font-medium text-grayscale-100/[.85]"
        onClick={onLoginWithKakao}
      >
        <img className="w-4" src={kakaoSymbol} alt="Kakao" />
        카카오 로그인
        <div />
      </button>
      <div className="my-7 h-px w-full bg-grayscale-20" />
      <a
        href={URL_CS}
        target="_blank"
        className="flex w-full items-center justify-center rounded-full border border-primary-peach p-3.5 text-base font-bold text-grayscale-100"
      >
        <img className="mr-2 w-[14px]" src={home} alt="cs" />
        고객센터
      </a>
    </Layout>
  );
};

export default withAuth(Login, "guest");
