import { useMemo } from "react";
import { getAnswers, getTodayQuestion } from "../common/apis";
import useAsyncAPI from "../hooks/useAsyncAPI";
import { Answer as AnswerType } from "../@types";
import { getFormattedDate, getLocalTime, groupBy } from "../common/utils";
import { useAuthenticatedState } from "../contexts/AuthContext";

import { Link } from "react-router-dom";
import Error from "../components/Error";
import Loading from "../components/Loading";
import Header from "../components/Header";
import Badge from "../components/Badge";
import Box from "../components/Box";
import Chart from "../components/Chart";
import Icon from "../components/Icon";

import answerIcon from "../assets/answer.png";
import replyIcon from "../assets/reply.svg";
import rightArrowIcon from "../assets/right_arrow.svg";

const Answer = ({
  answer,
  answers,
}: {
  answer: AnswerType;
  answers: AnswerType[];
}) => {
  const { id, question, option } = answer;

  const sameAnswers = groupBy(answers, (answer) => answer.option.id).get(
    option.id
  );
  const ratio = (sameAnswers?.length || 0) / answers.length;

  return (
    <Box>
      <Badge className="bg-question-not-today">
        {getFormattedDate(question.createdAt)}
      </Badge>
      <article className="my-6 px-2">
        <div className="mb-1.5 text-lg font-medium">{question.title}</div>
        <div className="text-primary">
          <Icon src={replyIcon} alt="reply" />
          <span className="align-middle">{option.text}</span>
        </div>
      </article>
      <Link
        to={`${id}/report`}
        className="flex w-full items-center justify-between"
      >
        <Chart.Summary value={ratio}>
          {"전체 타이티 중에 {value}를 차지하고 있어요."}
        </Chart.Summary>
        <img src={rightArrowIcon} alt="arrow" />
      </Link>
    </Box>
  );
};

const TodayQuestion = () => {
  const { state, data } = useAsyncAPI(getTodayQuestion);

  const question =
    state === "loading"
      ? "오늘의 질문을 불러오고 있어요..."
      : state === "error"
      ? "에러가 발생했어요 :("
      : data.status === 204
      ? "오늘의 질문이 없어요 :("
      : data.data.title;

  return (
    <article className="mb-8 flex w-full flex-col items-start rounded-2xl border border-grayscale-20 bg-white p-6 text-base drop-shadow-lg">
      <Badge className="bg-primary-peach">TODAY</Badge>
      <div className="my-6 px-2 text-lg font-medium">{question}</div>
      <Link to="/question" className="flex w-full items-center">
        <Icon src={replyIcon} alt="reply" />
        <div className="grow text-grayscale-20">대답하러 가기</div>
        <img src={rightArrowIcon} alt="arrow" />
      </Link>
    </article>
  );
};

const Main = ({
  answers,
  myAnswers,
}: {
  answers: AnswerType[];
  myAnswers: AnswerType[];
}) => {
  const isAnsweredTodayQuestion =
    myAnswers[0]?.question.createdAt === getLocalTime().format("YYYYMMDD");

  const answersByQuestionIdMap = useMemo(
    () => groupBy(answers, (answer) => answer.question.id),
    [answers]
  );

  return (
    <main>
      {!isAnsweredTodayQuestion && (
        <section>
          <TodayQuestion />
        </section>
      )}
      <section>
        <Box.Container>
          {myAnswers.length !== 0 ? (
            myAnswers.map((myAnswer) => (
              <Answer
                key={myAnswer.id}
                answer={myAnswer}
                answers={
                  answersByQuestionIdMap.get(myAnswer.question.id) || [myAnswer]
                }
              />
            ))
          ) : (
            <div className="mt-12 text-center text-base text-grayscale-80">
              아직 질문에 응답한 내역이 없어요 :)
            </div>
          )}
        </Box.Container>
      </section>
    </main>
  );
};

const ActualAnswers = ({
  answers,
  myAnswers,
}: {
  answers: AnswerType[];
  myAnswers: AnswerType[];
}) => (
  <>
    <Header className="flex items-center">
      <Header.Title iconSrc={answerIcon} alt="answer">
        나의 대답
      </Header.Title>
    </Header>
    <Main answers={answers} myAnswers={myAnswers} />
  </>
);

const Answers = () => {
  const {
    user: { uid },
  } = useAuthenticatedState();
  const { state, data } = useAsyncAPI(getAnswers);

  switch (state) {
    case "loading":
      return <Loading.Full />;

    case "error":
      return <Error.Default />;

    case "loaded":
      const answersByUserIdMap = groupBy(data.data, (answer) => answer.user.id);
      return (
        <ActualAnswers
          answers={data.data}
          myAnswers={answersByUserIdMap.get(uid) || []}
        />
      );
  }
};

export default Answers;
