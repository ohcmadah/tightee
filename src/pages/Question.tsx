import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { answer, getOptions, getQuestion } from "../common/apis";
import useAsyncAPI from "../hooks/useAsyncAPI";
import { URL_CS } from "../common/constants";
import { Question as QuestionType } from "../@types";
import { getLocalTime } from "../common/utils";
import { useTodayQuestion } from "../contexts/TodayQuestionContext";
import { useMyAnswers } from "../contexts/MyAnswersContext";

import Header from "../components/Header";
import Button from "../components/Button";
import Loading from "../components/Loading";
import ErrorView from "../components/ErrorView";
import ExternalLink from "../components/ExternalLink";
import Footer from "../components/Footer";
import ModalPortal from "../components/ModalPortal";
import Notice from "../components/Notice";
import Img from "../components/Img";
import Spinner from "../components/Spinner";

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
  optionIds,
  onAnswer,
}: {
  optionIds: string[];
  onAnswer: (id: string) => any;
}) => {
  const { state, data: options } = useAsyncAPI(getOptions, { ids: optionIds });
  switch (state) {
    case "loading":
      return (
        <section className="flex flex-col gap-y-4">
          {optionIds.map((id) => (
            <Button.Basic key={id} className="leading-8">
              <Spinner.Small />
            </Button.Basic>
          ))}
        </section>
      );

    case "error":
      return <section>문제가 발생했습니다. 다시 시도해 주세요 :(</section>;

    case "loaded":
      return (
        <section className="flex flex-col gap-y-4">
          {options.data.map((option) => (
            <Button.Basic
              key={option.text}
              className="leading-8"
              onClick={() => onAnswer(option.id)}
            >
              {option.text}
            </Button.Basic>
          ))}
        </section>
      );
  }
};

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
    <OptionSection optionIds={question.options} onAnswer={onAnswer} />
  </main>
);

type QuestionError = "expired-question" | "already-answered";

const ActualQuestion = ({ question }: { question: QuestionType }) => {
  const navigate = useNavigate();
  const { forceUpdate } = useTodayQuestion();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<QuestionError | null>(null);

  const onAnswer = async (optionId: string) => {
    const today = getLocalTime().format("YYYYMMDD");
    if (today !== question.createdAt) {
      return setError("expired-question");
    }
    setIsLoading(true);
    try {
      const { data } = await answer(question.id, optionId);
      setIsLoading(false);
      navigate("/answer/" + data.id + "/report");
    } catch (error: any) {
      setIsLoading(false);
      if (error.code === 400) {
        setError("already-answered");
      }
    }
  };

  switch (error) {
    case "expired-question":
      return (
        <ErrorView.ExpiredQuestion
          onReload={() => {
            forceUpdate();
            navigate("/question");
            setError(null);
          }}
        />
      );

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
          <Main question={question} onAnswer={onAnswer} />
          <Footer className="text-center">
            <Tip />
          </Footer>
          <ModalPortal>{isLoading && <Loading.Modal />}</ModalPortal>
        </>
      );
  }
};

const TodayQuestion = () => {
  const { data: todayQuestion } = useTodayQuestion();

  if (!todayQuestion) {
    return (
      <ErrorView.Default>
        <article>
          오늘의 질문이 존재하지 않습니다.
          <br />
          <ExternalLink className="text-primary" href={URL_CS}>
            고객센터
          </ExternalLink>
          로 문의해 주세요.
        </article>
      </ErrorView.Default>
    );
  }

  return <ActualQuestion question={todayQuestion} />;
};

const Question = ({ questionId }: { questionId: string }) => {
  const navigate = useNavigate();
  const { state, data } = useAsyncAPI(getQuestion, questionId);

  switch (state) {
    case "loading":
      return <Loading.Full />;

    case "error":
      return <ErrorView.Default />;

    case "loaded":
      if (data.status === 204) {
        return (
          <ErrorView.Default>
            <article>질문이 존재하지 않습니다.</article>
          </ErrorView.Default>
        );
      }

      const today = getLocalTime().format("YYYYMMDD");
      if (today !== data.data.createdAt) {
        return (
          <ErrorView.ExpiredQuestion
            onReload={() => {
              navigate("/question");
            }}
          />
        );
      }

      return <ActualQuestion question={data.data} />;
  }
};

const QuestionWrapper = () => {
  const { questionId } = useParams();
  const { data: todayQuestion } = useTodayQuestion();
  const { data: myAnswers } = useMyAnswers();
  const answer = myAnswers.find(
    (answer) => answer.question.id === (questionId || todayQuestion?.id)
  );
  if (answer) {
    return <Navigate to={"/answer/" + answer.id + "/report"} />;
  }
  return questionId ? <Question questionId={questionId} /> : <TodayQuestion />;
};

export default QuestionWrapper;
