import React, { useState } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { answer } from "../common/apis";
import { Question as QuestionType } from "../@types";
import { getLocalTime } from "../common/utils";
import { auth } from "../config";
import { useMyAnswersQuery } from "../hooks/queries/useMyAnswersQuery";

import Header from "../components/Header";
import Button from "../components/Button";
import Loading from "../components/Loading";
import ErrorView from "../components/ErrorView";
import Footer from "../components/Footer";
import ModalPortal from "../components/ModalPortal";
import Notice from "../components/Notice";
import Img from "../components/Img";
import { useQuestionQuery } from "../hooks/queries/useQuestionQuery";

const Tip = () => (
  <Notice
    iconSrc="/images/light.png"
    alt="light"
    className="text-sm leading-6 text-grayscale-60"
  >
    질문에 대답하면 MBTI, 성별, 나이별, 지역별 등<br />
    재미있는 분석 결과를 즉시 확인할 수 있어요 :)
  </Notice>
);

const OptionSection = ({
  options,
  onAnswer,
}: {
  options: QuestionType["options"];
  onAnswer: (id: string) => any;
}) => (
  <section className="flex flex-col gap-y-4">
    {Object.entries(options).map(([id, text]) => (
      <Button.Basic key={id} className="leading-8" onClick={() => onAnswer(id)}>
        {text}
      </Button.Basic>
    ))}
  </section>
);

const QuestionSection = ({ title }: { title: string }) => {
  return (
    <section className="mb-14 flex flex-col items-center">
      <Img
        lazy
        width={30}
        className="mb-3"
        src="/images/thinking.png"
        alt="thinking"
      />
      <h2 className="text-center text-lg font-bold">{title}</h2>
    </section>
  );
};

const Main = ({
  question,
  onAnswer,
}: {
  question: QuestionType;
  onAnswer: (id: string) => any;
}) => (
  <main>
    <QuestionSection title={question.title} />
    <OptionSection options={question.options} onAnswer={onAnswer} />
  </main>
);

type QuestionError = "expired-question" | "already-answered";

const ExpiredError = ({
  setError,
}: {
  setError: React.Dispatch<React.SetStateAction<QuestionError | null>>;
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return (
    <ErrorView.ExpiredQuestion
      onReload={() => {
        queryClient.invalidateQueries({ queryKey: ["questions"] });
        navigate("/answer");
        setError(null);
      }}
    />
  );
};

const ActualQuestion = ({ question }: { question: QuestionType }) => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<QuestionError | null>(null);

  const onAnswer = useMutation({
    mutationFn: async (optionId: string) => {
      const today = getLocalTime().format("YYYYMMDD");
      if (today !== question.createdAt) {
        throw new Error("expired-question");
      }
      try {
        await answer(question.id, optionId);
      } catch (error: any) {
        if (error.code === 400) {
          throw new Error("already-answered");
        }
      }
    },
    onError: (error: any) => {
      setError(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["answers", auth.currentUser?.uid]);
      queryClient.invalidateQueries(["answerGroups"]);
    },
  });

  switch (error) {
    case "expired-question":
      return <ExpiredError setError={setError} />;

    case "already-answered":
      return <Navigate to="/answer" />;

    default:
      return (
        <>
          <Header className="flex items-center">
            <Header.H1>
              <Header.Icon iconSrc="/images/question.png" alt="question">
                오늘의 질문
              </Header.Icon>
            </Header.H1>
          </Header>
          <Main question={question} onAnswer={onAnswer.mutate} />
          <Footer className="text-center">
            <Tip />
          </Footer>
          <ModalPortal>{onAnswer.isLoading && <Loading.Modal />}</ModalPortal>
        </>
      );
  }
};

const Question = ({ questionId }: { questionId: string }) => {
  const navigate = useNavigate();
  const { status, data: question } = useQuestionQuery(questionId);

  switch (status) {
    case "loading":
      return <Loading.Full />;

    case "error":
      return <ErrorView.Default />;

    case "success":
      if (!question) {
        return (
          <ErrorView.Default>
            <article>질문이 존재하지 않습니다.</article>
          </ErrorView.Default>
        );
      }

      const today = getLocalTime().format("YYYYMMDD");
      if (today !== question.createdAt) {
        return (
          <ErrorView.ExpiredQuestion
            onReload={() => {
              navigate("/questions");
            }}
          />
        );
      }

      return <ActualQuestion question={question} />;
  }
};

const QuestionWrapper = () => {
  const { questionId } = useParams();
  const uid = auth.currentUser?.uid;
  const { isLoading, isError, data: myAnswers } = useMyAnswersQuery(uid);

  if (isLoading) {
    return <Loading.Full />;
  }
  if (isError) {
    return <ErrorView.Default />;
  }

  const answer = myAnswers.find((answer) => answer.question === questionId);
  if (answer) {
    return <Navigate to={"/answer/" + answer.id + "/report"} />;
  }

  return questionId ? (
    <Question questionId={questionId} />
  ) : (
    <Navigate to="/answer" />
  );
};

export default QuestionWrapper;
