import {
  getAnswerGroups,
  getMyAnswers,
  getTodayQuestion,
} from "../common/apis";
import useAsyncAPI from "../hooks/useAsyncAPI";
import { Answer as AnswerType, Option } from "../@types";
import { getFormattedDate, getLocalTime, groupBy } from "../common/utils";
import { useAuthenticatedState } from "../contexts/AuthContext";

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

type PageData = Awaited<ReturnType<typeof getAnswersPageData>>;

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
      <article className="my-6 px-2">
        <div className="mb-1.5 text-lg font-medium">{question.title}</div>
        <div className="text-primary">
          <Icon src="/images/reply.svg" alt="reply" />
          <span className="align-middle">{option.text}</span>
        </div>
      </article>
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

const Main = ({ answersByQuestionIdMap, myAnswers }: PageData) => {
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

const ActualAnswers = ({ answersByQuestionIdMap, myAnswers }: PageData) => (
  <>
    <Header>
      <Header.H1 className="flex items-center">
        <Header.Icon iconSrc="/images/answer.png" alt="answer">
          나의 대답
        </Header.Icon>
      </Header.H1>
    </Header>
    <Main
      answersByQuestionIdMap={answersByQuestionIdMap}
      myAnswers={myAnswers}
    />
  </>
);

const getAnswersPageData = async (uid: string) => {
  const myAnswersPromise = getMyAnswers(uid);
  const answerGroupsPromise = getAnswerGroups({ groups: ["question.id"] });
  const [myAnswers, answerGroups] = await Promise.allSettled([
    myAnswersPromise,
    answerGroupsPromise,
  ]);
  if (myAnswers.status === "rejected") {
    throw new Error(myAnswers.reason);
  }
  if (answerGroups.status === "rejected") {
    throw new Error(answerGroups.reason);
  }
  return {
    myAnswers: myAnswers.value,
    answersByQuestionIdMap: answerGroups.value["question.id"],
  };
};

const Answers = () => {
  const { user } = useAuthenticatedState();
  const { state, data } = useAsyncAPI(getAnswersPageData, user.uid);

  switch (state) {
    case "loading":
      return <Loading.Full />;

    case "error":
      return <ErrorView.Default />;

    case "loaded":
      return (
        <ActualAnswers
          answersByQuestionIdMap={data.answersByQuestionIdMap}
          myAnswers={data.myAnswers}
        />
      );
  }
};

export default Answers;
