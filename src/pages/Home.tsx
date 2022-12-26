import { useMemo } from "react";
import { MBTI } from "../@types";
import { getMBTIName } from "../common/utils";
import { useUser } from "../contexts/UserContext";
import { useTodayQuestion } from "../contexts/TodayQuestionContext";
import { useMyAnswers } from "../contexts/MyAnswersContext";

import { Link } from "react-router-dom";
import Header from "../components/Header";
import Badge from "../components/Badge";
import Box from "../components/Box";
import Img from "../components/Img";
import Notice from "../components/Notice";

const Footer = () => (
  <Notice
    iconSrc="/images/star.png"
    alt="clock"
    className="mt-10 text-sm text-grayscale-60"
  >
    즐겨찾기하고 언제나 놀러오세요 :)
  </Notice>
);

const Content = ({
  iconSrc = "/images/right_arrow.svg",
  alt,
  children,
}: {
  iconSrc: string;
  alt: string;
  children: React.ReactNode;
}) => (
  <div className="mt-4 flex w-full items-center justify-between px-1">
    <div className="mr-3">{children}</div>
    <Img lazy src={iconSrc} alt={alt} />
  </div>
);

const Main = ({
  question,
  answer,
  MBTI,
}: {
  question: string;
  answer: { id?: string; count: number };
  MBTI?: MBTI;
}) => {
  return (
    <main>
      <Box.Container>
        <Link to={answer.id ? `/answer/${answer.id}/report` : "/question"}>
          <Box>
            <Badge className="bg-secondary-question font-bold text-white">
              오늘의 질문
            </Badge>
            <Content iconSrc="/images/right_arrow.svg" alt="right arrow">
              {question}
            </Content>
          </Box>
        </Link>

        <Link to="/answer">
          <Box>
            <Badge className="bg-secondary-answer font-bold text-white">
              나의 대답
            </Badge>
            <Content iconSrc="/images/right_arrow.svg" alt="right arrow">
              총 {answer?.count}개의 질문에 대답했어요.
            </Content>
          </Box>
        </Link>

        <Link to="/profile">
          <Box className="mb-0">
            <Badge className="bg-secondary-mbti font-bold text-white">
              나의 MBTI
            </Badge>
            <Content iconSrc={"/images/setting.svg"} alt="setting">
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

const Home = () => {
  const user = useUser();
  const todayQuestion = useTodayQuestion();
  const myAnswers = useMyAnswers();
  const todayAnswer = useMemo(
    () =>
      myAnswers.data.find(
        (answer) => answer.question === todayQuestion.data?.id
      ),
    [myAnswers]
  );

  return (
    <>
      <Header>
        <Header.H1>
          <Header.Icon iconSrc="/images/home.png">타이티입니다 :)</Header.Icon>
        </Header.H1>
      </Header>
      <Main
        question={
          todayQuestion.data
            ? todayQuestion.data.title
            : "오늘의 질문이 존재하지 않아요 :("
        }
        answer={{ id: todayAnswer?.id, count: myAnswers.data.length }}
        MBTI={user.data.MBTI}
      />
      <Footer />
    </>
  );
};

export default Home;
