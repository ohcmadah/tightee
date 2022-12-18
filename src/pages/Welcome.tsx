import { useLocation } from "react-router-dom";
import { loginWithKakao } from "../common/apis";

import Layout from "../components/Layout";
import Header from "../components/Header";
import withAuth from "../hocs/withAuth";

import chickIcon from "../assets/chick.png";
import Button from "../components/Button";

const Welcome = () => {
  const { state } = useLocation();

  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(process.env.KAKAO_JAVASCRIPT_KEY);
  }

  return (
    <Layout className="flex h-[100vh] flex-col items-center justify-center">
      <Header>
        <Header.H2>재미있는 리포트가 기다리고 있어요!</Header.H2>
      </Header>
      <section className="text-center text-base leading-7">
        <img
          src={chickIcon}
          alt="chick"
          className="mx-auto mb-2"
          width={30}
          height={30}
        />
        MBTI 맞춤 분석을 위해 간단한 회원가입이 필요해요.
        <br />
        하루에 하나씩 주어지는 질문에 대답하고
        <br />
        맞춤형 분석 리포트를 실시간으로 확인해보세요 :)
      </section>
      <Button.Kakao
        className="mt-14"
        onClick={() => loginWithKakao(state.questionId)}
      />
    </Layout>
  );
};

export default withAuth(Welcome, "guest");
