import {
  getAnswerGroups,
  getMyAnswers,
  getTodayQuestion,
} from "../common/apis";
import useAsyncAPI from "../hooks/useAsyncAPI";
import { Answer as AnswerType, Option } from "../@types";
import { getFormattedDate, getLocalTime, groupBy } from "../common/utils";
import { useAuthenticatedState } from "../contexts/AuthContext";
import { User } from "firebase/auth";

import { Link } from "react-router-dom";
import ErrorView from "../components/ErrorView";
import Loading from "../components/Loading";
import Header from "../components/Header";
import Badge from "../components/Badge";
import Box from "../components/Box";
import Chart from "../components/Chart";
import Icon from "../components/Icon";

import answerIcon from "../assets/answer.png";
import replyIcon from "../assets/reply.svg";
import rightArrowIcon from "../assets/right_arrow.svg";
import writingHand from "../assets/writing_hand.png";
import Notice from "../components/Notice";

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
          <Icon src={replyIcon} alt="reply" />
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

const AlreadyAnswered = () => (
  <Notice
    iconSrc={writingHand}
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
      <section>
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
      </section>
    </main>
  );
};

const ActualAnswers = ({ answersByQuestionIdMap, myAnswers }: PageData) => (
  <>
    <Header>
      <Header.H1 className="flex items-center">
        <Header.Icon iconSrc={answerIcon} alt="answer">
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
  const myAnswers = await getMyAnswers(uid);
  const answerGroups = await getAnswerGroups({ groups: ["question.id"] });
  return { myAnswers, answersByQuestionIdMap: answerGroups["question.id"] };
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
