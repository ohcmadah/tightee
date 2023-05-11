import React, { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import cn from "classnames";
import { Question as QuestionType } from "../@types/question";
import { Answer } from "../@types/answer";
import { getFormattedDate, getLocalTime, groupBy } from "../common/utils";
import { useMyAnswersQuery } from "../hooks/queries/useMyAnswersQuery";
import { useQuestionsQuery } from "../hooks/queries/useQuestionsQuery";
import { useAuthenticatedState } from "../contexts/AuthContext";

import ErrorView from "../components/ErrorView";
import Skeleton from "../components/Skeleton";
import Header from "../components/Header";
import Box from "../components/Box";
import Button from "../components/Button";
import Img from "../components/Img";

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

const Checkbox = ({ checked }: { checked: boolean }) => {
  return checked ? (
    <Img
      src="/images/checked.svg"
      className="mr-4 mt-2 h-[30px] w-[30px] flex-none"
    />
  ) : (
    <div className="mr-4 mt-2 h-[30px] w-[30px] flex-none rounded-full border-[2px] border-primary" />
  );
};

const Date = ({ isToday, date }: { isToday: boolean; date: string }) => (
  <h3 className={cn("mb-2.5 text-lg font-bold", { "text-[#ED7D31]": isToday })}>
    {isToday ? "Today" : getFormattedDate(date)}
  </h3>
);

const Divider = ({ className }: { className?: cn.Argument }) => (
  <div className={cn(className, "h-[1px] w-full rounded-full")}></div>
);

const Title = ({ children }: { children: React.ReactNode }) => (
  <div className="text-base font-medium">{children}</div>
);

const Author = ({ children }: { children: React.ReactNode }) => (
  <span className="mt-1 text-xs text-grayscale-60">{children}</span>
);

const NotAnsweredQuestion = ({
  isToday,
  question,
}: {
  isToday: boolean;
  question: QuestionType;
}) => {
  const navigate = useNavigate();

  return (
    <li className="flex">
      <Checkbox checked={false} />
      <Box
        onClick={() => isToday && navigate("/questions/" + question.id)}
        className={cn(
          "flex-row",
          { "select-none opacity-50": !isToday },
          { "cursor-pointer": isToday }
        )}
      >
        <div className="flex w-full items-center justify-between">
          <div>
            <Title>{question.title}</Title>
            {question.author && <Author>{question.author}</Author>}
          </div>
          {isToday && <Img src="/images/right_arrow.svg" />}
        </div>
      </Box>
    </li>
  );
};

const Question = ({
  isToday,
  answer,
  question,
}: {
  isToday: boolean;
  answer?: Answer;
  question: QuestionType;
}) => {
  if (!answer) {
    return <NotAnsweredQuestion isToday={isToday} question={question} />;
  }

  return (
    <li className="flex">
      <Checkbox checked={true} />
      <Link to={"/answer/" + answer.id + "/report"} className="w-full">
        <Box>
          <Title>{question.title}</Title>
          <Author>{question.author ? question.author : "Tightee"}</Author>
          <Divider className="my-3 bg-grayscale-10" />
          <div className="flex w-full items-center justify-between">
            <div>
              <Img
                src="/images/reply.svg"
                className="mr-2 inline-block"
                width={16}
              />
              <span className="align-middle text-sm text-grayscale-80">
                {question.options[answer.option]}
              </span>
            </div>
            <Img src="/images/right_arrow.svg" className="h-4 object-contain" />
          </div>
        </Box>
      </Link>
    </li>
  );
};

const Main = () => {
  const auth = useAuthenticatedState();
  const allQuestions = useQuestionsQuery();
  const answers = useMyAnswersQuery(auth.user.uid);

  const today = getLocalTime().format("YYYYMMDD");
  const questions = useMemo(() => {
    if (!allQuestions.isSuccess) {
      return [];
    }
    const questionByDateMap = groupBy(
      allQuestions.data,
      (question) => question.createdAt
    );
    return [...questionByDateMap.entries()]
      .sort(([a], [b]) => Number(b) - Number(a))
      .filter(([date]) => Number(date) <= Number(today));
  }, [allQuestions]);

  if (answers.isLoading || allQuestions.isLoading) {
    return (
      <Box.Container>
        {new Array(3).fill(0).map((_, i) => (
          <AnswerPlaceholder key={i} />
        ))}
      </Box.Container>
    );
  }

  if (answers.isError || allQuestions.isError) {
    return <ErrorView.Default />;
  }

  const answerByQuestionIdMap = answers.data.reduce(
    (acc: Record<string, Answer>, answer) => ({
      ...acc,
      [answer.question]: answer,
    }),
    {}
  );

  return (
    <ul>
      {questions.map(([date, questions]) => {
        const isToday = date === today;
        return (
          <li key={date} className="mb-14 last:mb-0">
            <Date isToday={isToday} date={date} />
            <Divider className={isToday ? "bg-primary" : "bg-grayscale-10"} />
            <Box.Container className="mt-7 gap-y-4">
              {questions.map((question) => (
                <Question
                  key={question.id}
                  isToday={isToday}
                  answer={answerByQuestionIdMap[question.id]}
                  question={question}
                />
              ))}
            </Box.Container>
          </li>
        );
      })}
    </ul>
  );
};

const Answers = () => {
  useEffect(() => {
    const imgs = ["reply.svg", "right_arrow.svg", "chart.png"];
    imgs.forEach((src) => (new Image().src = "/images/" + src));
  }, []);

  return (
    <>
      <Header>
        <Header.H1>나의 대답</Header.H1>
      </Header>
      <Main />
      <Button.GoogleForm />
    </>
  );
};

export default Answers;
