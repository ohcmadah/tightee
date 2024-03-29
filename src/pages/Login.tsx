import { URL_CS } from "../common/constants";
import { loginWithKakao } from "../common/apis";

import Layout from "../components/Layout";
import Button from "../components/Button";
import withAuth from "../hocs/withAuth";
import Img from "../components/Img";

const Login = () => {
  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(process.env.KAKAO_JAVASCRIPT_KEY);
  }

  return (
    <Layout className="flex h-[100vh] flex-col items-center justify-center">
      <h1>
        <Img src="/tightee.svg" alt="Tightee" />
      </h1>
      <h2 className="mt-2 select-none text-base font-bold text-grayscale-60">
        하루에 질문 세 개로 만드는 나만의 다이어리
      </h2>
      <div className="mt-3 select-none text-center text-base font-bold text-grayscale-80">
        매일마다 나의 취향을 기록하고
        <br />
        MBTI 등 다양한 분석을 경험해보세요.
      </div>
      <Button.Kakao className="mt-12" onClick={() => loginWithKakao()} />
      <a
        href={URL_CS}
        target="_blank"
        className="mt-5 flex w-full items-center justify-center p-3.5 text-base text-grayscale-100"
      >
        <Img lazy className="mr-2" width={14} src="/images/home.png" alt="cs" />
        고객센터
      </a>
    </Layout>
  );
};

export default withAuth(Login, "guest");
