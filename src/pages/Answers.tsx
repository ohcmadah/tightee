import { getAnswers, getTodayQuestionDoc } from "../common/apis";
import useAsyncAPI from "../hooks/useAsyncAPI";
import { Answer as AnswerType } from "../@types";
import { getFormattedDate, getLocalTime } from "../common/utils";
import { useAuthenticatedState } from "../contexts/AuthContext";

import { Link } from "react-router-dom";
import Error from "../components/Error";
import Loading from "../components/Loading";
import Header from "../components/Header";
import Badge from "../components/Badge";
import Box from "../components/Box";

import answerIcon from "../assets/answer.png";
import replyIcon from "../assets/reply.svg";
import chartIcon from "../assets/chart.png";
import rightArrowIcon from "../assets/right_arrow.svg";

const Answer = ({ answer }: { answer: AnswerType }) => {
  const { question, option, ratio } = answer;
  return (
    <Box.Container>
      <Box>
        <Badge className="bg-question-not-today">
          {getFormattedDate(question.createdAt)}
        </Badge>
        <article className="my-6 px-2">
          <div className="mb-1.5 text-lg font-medium">{question.title}</div>
          <div className="text-primary">
            <img src={replyIcon} alt="reply" className="mr-1.5 inline-block" />
            <span className="align-middle">{option.text}</span>
          </div>
        </article>
        <Link to={`${answer.id}/report`} className="flex w-full items-center">
          <img
            width={20}
            src={chartIcon}
            alt="chart"
            className="mr-1.5 inline-block"
          />
          <div className="grow">
            전체 타이티 중에{" "}
            <span className="text-primary">{ratio * 100}%</span>를 차지하고
            있어요.
          </div>
          <img src={rightArrowIcon} alt="arrow" />
        </Link>
      </Box>
    </Box.Container>
  );
};

const TodayQuestion = () => {
  const { state, data } = useAsyncAPI(getTodayQuestionDoc);

  return (
    <article className="mb-8 flex w-full flex-col items-start rounded-2xl border border-grayscale-20 bg-white p-6 text-base drop-shadow-lg">
      <Badge className="bg-primary-peach">TODAY</Badge>
      <div className="my-6 px-2 text-lg font-medium">
        {state === "loaded"
          ? data.data().title
          : state === "loading"
          ? "오늘의 질문을 불러오고 있어요..."
          : "에러가 발생했어요 :("}
      </div>
      <Link to="/question" className="flex w-full items-center">
        <img src={replyIcon} alt="reply" className="mr-1.5 inline-block" />
        <div className="grow text-grayscale-20">대답하러 가기</div>
        <img src={rightArrowIcon} alt="arrow" />
      </Link>
    </article>
  );
};

const Main = ({ answers }: { answers: AnswerType[] }) => {
  const isAnsweredTodayQuestion =
    answers[0]?.question.createdAt === getLocalTime().format("YYYYMMDD");

  return (
    <main>
      <section>{!isAnsweredTodayQuestion && <TodayQuestion />}</section>
      <section>
        {answers.length !== 0 ? (
          answers.map((answer) => <Answer key={answer.id} answer={answer} />)
        ) : (
          <div className="mt-12 text-center text-base text-grayscale-80">
            아직 질문에 응답한 내역이 없어요 :)
          </div>
        )}
      </section>
    </main>
  );
};

const ActualAnswers = ({ answers }: { answers: AnswerType[] }) => (
  <>
    <Header className="flex items-center">
      <Header.Title iconSrc={answerIcon} alt="answer">
        나의 대답
      </Header.Title>
    </Header>
    <Main answers={answers} />
  </>
);

const Answers = () => {
  const {
    user: { uid },
  } = useAuthenticatedState();
  const { state, data } = useAsyncAPI(getAnswers, { user: uid });

  switch (state) {
    case "loading":
      return <Loading.Full />;

    case "error":
      return <Error.Default />;

    case "loaded":
      return <ActualAnswers answers={data.data} />;
  }
};

export default Answers;
