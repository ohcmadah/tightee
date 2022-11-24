import cn from "classnames";
import useAsyncAPI from "../hooks/useAsyncAPI";
import {
  getAnswerCount,
  getTodayAnswer,
  getTodayQuestionDoc,
} from "../common/apis";

import { Link, To } from "react-router-dom";
import Header from "../components/Header";
import Loading from "../components/Loading";
import Error from "../components/Error";

import homeIcon from "../assets/home.png";
import rightArrowIcon from "../assets/right_arrow.svg";

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

const Badge = ({
  className,
  children,
}: {
  className?: string | string[];
  children: React.ReactNode;
}) => (
  <span
    className={cn(
      "rounded-full py-1.5 px-5 text-base font-bold text-white",
      className
    )}
  >
    {children}
  </span>
);

const LinkItem = ({ to, children }: { to: To; children: React.ReactNode }) => (
  <li className="mb-8 rounded-2xl border border-grayscale-20 bg-white text-base drop-shadow-lg">
    <Link className="flex w-full flex-col items-start p-6" to={to}>
      {children}
    </Link>
  </li>
);

const Main = ({
  question,
  answer,
}: {
  question: string;
  answer: { id?: string; count: number };
}) => {
  return (
    <main>
      <ul className="last:0">
        <LinkItem to={answer.id ? `/answer/${answer.id}/report` : "/question"}>
          <Badge className="bg-secondary-question">오늘의 질문</Badge>
          <Content iconSrc={rightArrowIcon} alt="right arrow">
            {question}
          </Content>
        </LinkItem>

        <LinkItem to="/answer">
          <Badge className="bg-secondary-answer">나의 대답</Badge>
          <Content iconSrc={rightArrowIcon} alt="right arrow">
            총 {answer?.count}개의 질문에 대답했어요.
          </Content>
        </LinkItem>

        <LinkItem to="">
          <Badge className="bg-secondary-mbti">나의 MBTI</Badge>
          <Content iconSrc={rightArrowIcon} alt="right arrow">
            TODO:
          </Content>
        </LinkItem>
      </ul>
    </main>
  );
};

const Home = () => {
  const { state, data } = useAsyncAPI(async () => {
    const question = await getTodayQuestionDoc();
    const answerCount = await getAnswerCount();
    try {
      return { question, answerCount, answer: await getTodayAnswer() };
    } catch (error) {
      return { question, answerCount, answer: undefined };
    }
  });

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
          />
        </>
      );
  }
};

export default Home;
