import useAsyncAPI from "../hooks/useAsyncAPI";
import { getMyAnswers, getTodayQuestion, getUser } from "../common/apis";
import { useAuthenticatedState } from "../contexts/AuthContext";
import { User } from "firebase/auth";
import { MBTI } from "../@types";
import { getMBTIName } from "../common/utils";
import { auth } from "../config";

import { Link } from "react-router-dom";
import Header from "../components/Header";
import Loading from "../components/Loading";
import ErrorView from "../components/Error";
import Badge from "../components/Badge";

import homeIcon from "../assets/home.png";
import rightArrowIcon from "../assets/right_arrow.svg";
import settingIcon from "../assets/setting.svg";
import Box from "../components/Box";

const Content = ({
  iconSrc = rightArrowIcon,
  alt,
  children,
}: {
  iconSrc: string;
  alt: string;
  children: React.ReactNode;
}) => (
  <div className="mt-4 flex w-full items-center justify-between px-1">
    <div className="mr-3">{children}</div>
    <img src={iconSrc} alt={alt} />
  </div>
);

const Main = ({
  question,
  answer,
  MBTI,
}: {
  question: string;
  answer: { id?: string; count: number };
  MBTI: MBTI;
}) => {
  return (
    <main>
      <Box.Container>
        <Link to={answer.id ? `/answer/${answer.id}/report` : "/question"}>
          <Box>
            <Badge className="bg-secondary-question font-bold text-white">
              오늘의 질문
            </Badge>
            <Content iconSrc={rightArrowIcon} alt="right arrow">
              {question}
            </Content>
          </Box>
        </Link>

        <Link to="/answer">
          <Box>
            <Badge className="bg-secondary-answer font-bold text-white">
              나의 대답
            </Badge>
            <Content iconSrc={rightArrowIcon} alt="right arrow">
              총 {answer?.count}개의 질문에 대답했어요.
            </Content>
          </Box>
        </Link>

        <Link to="/profile">
          <Box className="mb-0">
            <Badge className="bg-secondary-mbti font-bold text-white">
              나의 MBTI
            </Badge>
            <Content iconSrc={settingIcon} alt="setting">
              {MBTI
                ? MBTI + " - " + getMBTIName(MBTI)
                : "MBTI를 설정하면 더욱 재미있는 정보를 확인할 수 있어요 :)"}
            </Content>
          </Box>
        </Link>
      </Box.Container>
    </main>
  );
};

const getHomeData = async (authUser: User) => {
  const token = await authUser.getIdToken();
  const user = await getUser(authUser.uid, token);
  if (!user) {
    await auth.signOut();
    throw new Error("다시 로그인해 주세요.");
  }

  const question = await getTodayQuestion();

  const answers = await getMyAnswers(authUser.uid, token);
  const todayAnswer = answers.filter(
    (answer) => answer.question.id === question.data.id
  );

  return {
    question:
      question.status === 204
        ? "오늘의 질문이 존재하지 않아요 :("
        : question.data.title,
    answer: {
      id: todayAnswer.length !== 0 ? todayAnswer[0].id : undefined,
      count: answers.length,
    },
    MBTI: user.MBTI,
  };
};

const Home = () => {
  const { user } = useAuthenticatedState();
  const { state, data } = useAsyncAPI(getHomeData, user);

  switch (state) {
    case "loading":
      return <Loading.Full />;

    case "error":
      return (
        <ErrorView.Default>
          <div>{`${data}`}</div>
        </ErrorView.Default>
      );

    case "loaded":
      return (
        <>
          <Header>
            <Header.Title iconSrc={homeIcon}>타이티입니다 :)</Header.Title>
          </Header>
          <Main
            question={data.question}
            answer={data.answer}
            MBTI={data.MBTI}
          />
        </>
      );
  }
};

export default Home;
