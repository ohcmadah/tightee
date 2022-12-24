import { getAnswerGroups } from "../common/apis";
import useAsyncAPI from "../hooks/useAsyncAPI";
import { Answer as AnswerType, Option } from "../@types";
import { getFormattedDate, getLocalTime, groupBy } from "../common/utils";
import { useMyAnswers } from "../contexts/MyAnswersContext";
import { useTodayQuestion } from "../contexts/TodayQuestionContext";

import { Link } from "react-router-dom";
import ErrorView from "../components/ErrorView";
import Loading from "../components/Loading";
import Header from "../components/Header";
import Badge from "../components/Badge";
import Box from "../components/Box";
import Chart from "../components/Chart";
import Icon from "../components/Icon";
import Notice from "../components/Notice";
import Img from "../components/Img";

type PageData = Awaited<ReturnType<typeof getAnswerGroups>>;

const Answer = ({
  answer,
  options,
}: {
  answer: AnswerType;
  options: Option[];
}) => {
  const { id, question, option } = answer;

  const sameAnswers = groupBy(options, (option) => option.id).get(option.id);
  const ratio = (sameAnswers?.length || 0) / options.length;

  return (
    <Box>
      <Badge className="bg-question-not-today">
        {getFormattedDate(question.createdAt)}
      </Badge>
      <div className="my-6 px-2">
        <div className="mb-1.5 text-lg font-medium">{question.title}</div>
        <div className="mt-1.5 inline-flex items-start text-primary">
          <Icon src="/images/reply.svg" alt="reply" />
          <div>{option.text}</div>
        </div>
      </div>
      <Link
        to={`${id}/report`}
        className="flex w-full items-center justify-between"
      >
        <Chart.Summary value={ratio} className="mr-3 truncate text-ellipsis">
          {"전체 타이티 중에 {value}에 속해요."}
        </Chart.Summary>
        <Img lazy src="/images/right_arrow.svg" alt="arrow" />
      </Link>
    </Box>
  );
};

const TodayQuestion = () => {
  const { data: todayQuestion } = useTodayQuestion();
  const title = todayQuestion ? todayQuestion.title : "오늘의 질문이 없어요 :(";

  return (
    <article className="mb-8 flex w-full flex-col items-start rounded-2xl border border-grayscale-20 bg-white p-6 text-base drop-shadow-lg">
      <Badge className="bg-primary-peach">TODAY</Badge>
      <div className="my-6 px-2 text-lg font-medium">{title}</div>
      <Link to="/question" className="flex w-full items-center">
        <Icon src="/images/reply.svg" alt="reply" />
        <div className="grow text-grayscale-20">대답하러 가기</div>
        <Img lazy src="/images/right_arrow.svg" alt="arrow" />
      </Link>
    </article>
  );
};

const AlreadyAnswered = () => (
  <Notice
    iconSrc="/images/writing_hand.png"
    alt="writing hand"
    className="mb-8 text-grayscale-60"
  >
    오늘 질문에 이미 대답하셨네요!
    <br />
    내일 또 재미있는 질문이 기다리고 있어요 :)
  </Notice>
);

const Main = ({ answersByQuestionIdMap }: PageData) => {
  const { data: myAnswers } = useMyAnswers();
  const isEmptyMyAnswers = myAnswers.length === 0;
  const isAnsweredTodayQuestion =
    !isEmptyMyAnswers &&
    myAnswers[0].question.createdAt === getLocalTime().format("YYYYMMDD");

  return (
    <main>
      {!isAnsweredTodayQuestion ? (
        <section>
          <TodayQuestion />
        </section>
      ) : (
        <AlreadyAnswered />
      )}
      <Box.Container>
        {isEmptyMyAnswers ? (
          <div className="mt-12 text-center text-base text-grayscale-80">
            아직 질문에 응답한 내역이 없어요 :)
          </div>
        ) : (
          myAnswers.map((myAnswer) => (
            <Answer
              key={myAnswer.id}
              answer={myAnswer}
              options={answersByQuestionIdMap[myAnswer.question.id]}
            />
          ))
        )}
      </Box.Container>
    </main>
  );
};

const ActualAnswers = ({ answersByQuestionIdMap }: PageData) => (
  <>
    <Header>
      <Header.H1 className="flex items-center">
        <Header.Icon iconSrc="/images/answer.png" alt="answer">
          나의 대답
        </Header.Icon>
      </Header.H1>
    </Header>
    <Main answersByQuestionIdMap={answersByQuestionIdMap} />
  </>
);

const Answers = () => {
  const { state, data: answerGroups } = useAsyncAPI(getAnswerGroups, {
    groups: ["question.id"],
  });

  switch (state) {
    case "loading":
      return <Loading.Full />;

    case "error":
      return <ErrorView.Default />;

    case "loaded":
      return (
        <ActualAnswers answersByQuestionIdMap={answerGroups["question.id"]} />
      );
  }
};

export default Answers;
