import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Answer as AnswerType } from "../@types";
import { getFormattedDate, getLocalTime, groupBy } from "../common/utils";
import { useMyAnswersQuery } from "../hooks/queries/useMyAnswersQuery";
import { useAnswerGroupsQuery } from "../hooks/queries/useAnswerGroupsQuery";
import { useQuestionsQuery } from "../hooks/queries/useQuestionsQuery";
import { useQuestionQuery } from "../hooks/queries/useQuestionQuery";
import { useAuthenticatedState } from "../contexts/AuthContext";

import ErrorView from "../components/ErrorView";
import Skeleton from "../components/Skeleton";
import Header from "../components/Header";
import Box from "../components/Box";
import Question from "../components/Question";
import Img from "../components/Img";
import Button from "../components/Button";

const AnswerPlaceholder = () => (
  <Box>
    <Skeleton.Container viewBox="0 0 340 147">
      <Skeleton.Badge width={120} />
      <Skeleton.Text x={7} y={50} width={330} size={20} />
      <Skeleton.Text x={7} y={84} width={80} size={20} />
      <Skeleton.Text y={126} width={200} size={20} />
    </Skeleton.Container>
  </Box>
);

const MyAnswer = ({
  answer,
  options,
}: {
  answer: AnswerType;
  options: string[];
}) => {
  const { id, question: questionId, option: optionId } = answer;
  const { isLoading, isError, data: question } = useQuestionQuery(questionId);

  if (isLoading || isError || !question || !options) {
    return <AnswerPlaceholder />;
  }

  const sameAnswers = groupBy(options, (option) => option).get(optionId);
  const ratio = (sameAnswers?.length || 0) / options.length;

  return (
    <Question
      createdAt={getFormattedDate(question.createdAt)}
      title={question.title}
      option={question.options[optionId]}
      linkProps={{ to: id + "/report", state: { question } }}
      ratio={ratio}
    />
  );
};

const MyAnswers = ({
  myAnswers,
}: {
  myAnswers: ReturnType<typeof useMyAnswersQuery>;
}) => {
  const {
    isLoading,
    isError,
    data: groups,
  } = useAnswerGroupsQuery(["question"]);

  if (myAnswers.isLoading || isLoading) {
    return (
      <Box.Container>
        {[0, 1, 2].map((i) => (
          <AnswerPlaceholder key={i} />
        ))}
      </Box.Container>
    );
  }

  if (myAnswers.isError || isError) {
    return <ErrorView.Default />;
  }

  const isEmptyMyAnswers = myAnswers.data.length === 0;
  const answerByQuestionIdMap = groups["question"];

  return (
    <Box.Container>
      {isEmptyMyAnswers ? (
        <div className="mt-12 text-center text-base text-grayscale-80">
          아직 질문에 응답한 내역이 없어요 :)
        </div>
      ) : (
        myAnswers.data.map((myAnswer) => (
          <MyAnswer
            key={myAnswer.id}
            answer={myAnswer}
            options={answerByQuestionIdMap[myAnswer.question]}
          />
        ))
      )}
    </Box.Container>
  );
};

const TodayQuestions = ({
  myAnswers,
}: {
  myAnswers: ReturnType<typeof useMyAnswersQuery>;
}) => {
  const navigate = useNavigate();
  const today = getLocalTime().format("YYYYMMDD");
  const todayQuestions = useQuestionsQuery([today], { date: today });

  if (todayQuestions.isLoading || myAnswers.isLoading) {
    return (
      <Box className="mb-8">
        <Skeleton.Container viewBox="0 0 100 5">
          <rect x="0" y="0" rx="3" ry="3" width="60" height="5" />
        </Skeleton.Container>
      </Box>
    );
  }

  if (todayQuestions.isError || myAnswers.isError) {
    return <ErrorView.Default />;
  }

  if (todayQuestions.data.length === 0) {
    return (
      <section className="mb-8">
        <Question
          createdAt="TODAY"
          title="오늘의 질문이 존재하지 않아요 :("
          linkProps={{ to: "/answer" }}
        />
      </section>
    );
  }

  const answeredQuestionIds = new Set(
    myAnswers.data.map(({ question }) => question)
  );
  const isAllAnswered = todayQuestions.data.every(({ id }) =>
    answeredQuestionIds.has(id)
  );

  if (!isAllAnswered) {
    return (
      <Box.Container className="mb-8">
        <Box className="cursor-pointer" onClick={() => navigate("/questions")}>
          <div className="flex w-full items-center justify-between text-sm">
            <span className="mr-3">
              아직 대답하지 않은 오늘의 질문이 있어요
            </span>
            <Img src="/images/right_arrow.svg" />
          </div>
        </Box>
      </Box.Container>
    );
  }

  return null;
};

const Answers = () => {
  const auth = useAuthenticatedState();
  const myAnswers = useMyAnswersQuery(auth.user.uid);

  useEffect(() => {
    const imgs = ["reply.svg", "right_arrow.svg", "chart.png"];
    imgs.forEach((src) => (new Image().src = "/images/" + src));
  }, []);

  return (
    <>
      <Header>
        <Header.H1 className="flex items-center">
          <Header.Icon iconSrc="/images/answer.png" alt="answer">
            나의 대답
          </Header.Icon>
        </Header.H1>
      </Header>
      <main>
        <TodayQuestions myAnswers={myAnswers} />
        <MyAnswers myAnswers={myAnswers} />
      </main>
      <Button.GoogleForm />
    </>
  );
};

export default Answers;
