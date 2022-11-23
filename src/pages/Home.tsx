import useAsyncAPI from "../hooks/useAsyncAPI";
import { getTodayAnswer, getTodayQuestionDoc } from "../common/apis";
import { Answer } from "../@types";

import { Link } from "react-router-dom";
import Header from "../components/Header";
import Loading from "../components/Loading";
import Error from "../components/Error";

import homeIcon from "../assets/home.png";
import rightArrowIcon from "../assets/right_arrow.svg";

const Box = ({ children }: { children: React.ReactNode }) => (
  <li className="mb-8 rounded-2xl border border-grayscale-20 bg-white text-base drop-shadow-lg">
    {children}
  </li>
);

const Main = ({
  question,
  answerId,
}: {
  question: string;
  answerId?: string;
}) => {
  return (
    <main>
      <ul className="last:0">
        <Box>
          <Link
            to={answerId ? `/answer/${answerId}/report` : "/question"}
            className="flex w-full flex-col items-start p-6"
          >
            <span className="rounded-full bg-secondary-question py-1.5 px-5 text-base font-bold text-white">
              오늘의 질문
            </span>
            <div className="mt-4 flex w-full justify-between px-1">
              {question}
              <img src={rightArrowIcon} alt="right arrow" />
            </div>
          </Link>
        </Box>
      </ul>
    </main>
  );
};

const Home = () => {
  const { state, data } = useAsyncAPI(async () => {
    const question = await getTodayQuestionDoc();
    try {
      return { question, answer: await getTodayAnswer() };
    } catch (error) {
      return { question, answer: undefined };
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
            answerId={data.answer?.id}
          />
        </>
      );
  }
};

export default Home;
