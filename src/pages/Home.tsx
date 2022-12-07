import cn from "classnames";
import useAsyncAPI from "../hooks/useAsyncAPI";
import {
  getAnswerCount,
  getTodayAnswer,
  getTodayQuestionDoc,
  getUser,
} from "../common/apis";
import { useAuthenticatedState } from "../contexts/AuthContext";
import { MBTI, User } from "../@types";
import { getMBTIName } from "../common/utils";

import { Link, To } from "react-router-dom";
import Header from "../components/Header";
import Loading from "../components/Loading";
import Error from "../components/Error";
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
    {children}
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

const getHomeData = async (uid: string) => {
  const question = await getTodayQuestionDoc();
  const answerCount = await getAnswerCount();
  const user = await getUser(uid);
  const res = { question, answerCount, MBTI: (user.data() as User).MBTI };
  try {
    return { ...res, answer: await getTodayAnswer() };
  } catch (error) {
    return { ...res, answer: undefined };
  }
};

const Home = () => {
  const { user } = useAuthenticatedState();
  const { state, data } = useAsyncAPI(getHomeData, user.uid);

  switch (state) {
    case "loading":
      return <Loading.Full />;

    case "error":
      return (
        <Error.Default>
          <div>{`${data}`}</div>
        </Error.Default>
      );

    case "loaded":
      return (
        <>
          <Header>
            <Header.Title iconSrc={homeIcon}>타이티입니다 :)</Header.Title>
          </Header>
          <Main
            question={data.question.data().title}
            answer={{ id: data.answer?.id, count: data.answerCount }}
            MBTI={data.MBTI}
          />
        </>
      );
  }
};

export default Home;
