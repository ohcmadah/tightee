import { useNavigate } from "react-router-dom";
import { getAnswerGroups, getQuestion } from "../common/apis";
import useAsyncAPI from "../hooks/useAsyncAPI";
import { Answer as AnswerType } from "../@types";
import { getFormattedDate, groupBy } from "../common/utils";
import { useMyAnswers } from "../contexts/MyAnswersContext";
import { useTodayQuestions } from "../contexts/TodayQuestionContext";

import ErrorView from "../components/ErrorView";
import Skeleton from "../components/Skeleton";
import Header from "../components/Header";
import Box from "../components/Box";
import Question from "../components/Question";
import Img from "../components/Img";
import { useEffect } from "react";

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
  const { state, data: question } = useAsyncAPI(getQuestion, questionId);

  const sameAnswers = groupBy(options, (option) => option).get(optionId);
  const ratio = (sameAnswers?.length || 0) / options.length;

  if (state !== "loaded") {
    return <AnswerPlaceholder />;
  }

  return (
    <Question
      createdAt={getFormattedDate(question.data.createdAt)}
      title={question.data.title}
      option={question.data.options[optionId]}
      linkProps={{ to: id + "/report", state: { question: question.data } }}
      ratio={ratio}
    />
  );
};

const MyAnswers = () => {
  const { state, data: groups } = useAsyncAPI(getAnswerGroups, {
    groups: ["question"],
  });
  const { isLoading, data: myAnswers } = useMyAnswers();

  if (isLoading || state === "loading") {
    return (
      <Box.Container>
        {[0, 1, 2].map((i) => (
          <AnswerPlaceholder key={i} />
        ))}
      </Box.Container>
    );
  }

  if (myAnswers instanceof Error || state === "error") {
    return <ErrorView.Default />;
  }

  const isEmptyMyAnswers = myAnswers.length === 0;

  return (
    <Box.Container>
      {isEmptyMyAnswers ? (
        <div className="mt-12 text-center text-base text-grayscale-80">
          아직 질문에 응답한 내역이 없어요 :)
        </div>
      ) : (
        myAnswers.map((myAnswer) => (
          <MyAnswer
            key={myAnswer.id}
            answer={myAnswer}
            options={groups["question"][myAnswer.question]}
          />
        ))
      )}
    </Box.Container>
  );
};

const TodayQuestions = () => {
  const navigate = useNavigate();
  const todayQuestions = useTodayQuestions();
  const myAnswers = useMyAnswers();

  if (todayQuestions.isLoading || myAnswers.isLoading) {
    return (
      <Box className="mb-8">
        <Skeleton.Container viewBox="0 0 100 5">
          <rect x="0" y="0" rx="3" ry="3" width="60" height="5" />
        </Skeleton.Container>
      </Box>
    );
  }

  if (todayQuestions.data instanceof Error || myAnswers.data instanceof Error) {
    return <ErrorView.Default />;
  }

  if (!todayQuestions.data) {
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
        <TodayQuestions />
        <MyAnswers />
      </main>
    </>
  );
};

export default Answers;
