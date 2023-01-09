import { getMBTIName } from "../common/utils";
import { useUser } from "../contexts/UserContext";
import { useTodayQuestions } from "../contexts/TodayQuestionContext";
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
  iconWidth = 9,
  children,
}: {
  iconSrc: string;
  alt: string;
  iconWidth?: string | number;
  children: React.ReactNode;
}) => (
  <div className="mt-4 flex w-full items-center justify-between px-1">
    <div className="mr-3">{children}</div>
    <Img lazy src={iconSrc} alt={alt} width={iconWidth} />
  </div>
);

const MBTI = () => {
  const {
    data: { MBTI: mbti },
  } = useUser();

  return (
    <Link to="/profile">
      <Box className="mb-0">
        <Badge className="bg-secondary-mbti font-bold text-white">
          나의 MBTI
        </Badge>
        <Content iconSrc="/images/setting.svg" alt="setting" iconWidth={20}>
          {mbti
            ? mbti + " - " + getMBTIName(mbti)
            : "MBTI를 설정하면 더욱 재미있는 정보를 확인할 수 있어요 :)"}
        </Content>
      </Box>
    </Link>
  );
};

const Answer = () => {
  const { data: myAnswers } = useMyAnswers();

  return (
    <Link to="/answer">
      <Box>
        <Badge className="bg-secondary-answer font-bold text-white">
          나의 대답
        </Badge>
        <Content iconSrc="/images/right_arrow.svg" alt="right arrow">
          총 {myAnswers.length}개의 질문에 대답했어요.
        </Content>
      </Box>
    </Link>
  );
};

const Question = () => {
  const { data: todayQuestions } = useTodayQuestions();
  const { data: myAnswers } = useMyAnswers();

  if (!todayQuestions) {
    return (
      <Box>
        <Badge className="bg-secondary-question font-bold text-white">
          오늘의 질문
        </Badge>
        <Content iconSrc="/images/right_arrow.svg" alt="right arrow">
          오늘의 질문이 존재하지 않아요 :(
        </Content>
      </Box>
    );
  }

  const answeredQuestionIds = new Set(
    myAnswers.map(({ question }) => question)
  );
  const answeredCount = todayQuestions.reduce(
    (count, { id }) => (answeredQuestionIds.has(id) ? count + 1 : count),
    0
  );
  const remaining = todayQuestions.length - answeredCount;
  const isAllAnswered = remaining === 0;

  return (
    <Link to={isAllAnswered ? "/answer" : "/questions"}>
      <Box>
        <Badge className="bg-secondary-question font-bold text-white">
          오늘의 질문
        </Badge>
        <Content iconSrc="/images/right_arrow.svg" alt="right arrow">
          {isAllAnswered
            ? "모든 질문에 대답을 완료했어요 👏"
            : remaining + "개의 질문이 남아있어요 🐰"}
        </Content>
      </Box>
    </Link>
  );
};

const Home = () => (
  <>
    <Header>
      <Header.H1>
        <Header.Icon iconSrc="/images/home.png">타이티입니다 :)</Header.Icon>
      </Header.H1>
    </Header>
    <main>
      <Box.Container>
        <Question />
        <Answer />
        <MBTI />
      </Box.Container>
    </main>
    <Footer />
  </>
);

export default Home;
