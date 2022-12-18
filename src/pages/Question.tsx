import { useState } from "react";
import { Navigate } from "react-router-dom";
import {
  answer,
  getMyAnswers,
  getOptions,
  getTodayQuestion,
} from "../common/apis";
import useAsyncAPI from "../hooks/useAsyncAPI";
import { URL_CS } from "../common/constants";
import { Option as OptionType } from "../@types";
import { getFormattedDate, getLocalTime } from "../common/utils";
import { useAuthenticatedState } from "../contexts/AuthContext";
import { User } from "firebase/auth";

import Header from "../components/Header";
import Button from "../components/Button";
import Loading from "../components/Loading";
import Error from "../components/Error";
import ExternalLink from "../components/ExternalLink";
import Footer from "../components/Footer";
import Badge from "../components/Badge";
import ModalPortal from "../components/ModalPortal";

import questionIcon from "../assets/question.png";
import thinkingIcon from "../assets/thinking.png";
import lightIcon from "../assets/light.png";

const Tip = () => (
  <>
    <img width={30} className="inline-block" src={lightIcon} alt="light" />
    <div className="mt-1.5 text-sm leading-6 text-grayscale-60">
      질문에 대답하면 MBTI, 성별, 나이별, 지역별 등<br />
      재미있는 분석 결과를 즉시 확인할 수 있어요 :)
    </div>
  </>
);

const OptionSection = ({
  options,
  onAnswer,
}: {
  options: OptionType[];
  onAnswer: (id: string) => any;
}) => (
  <section className="flex flex-col gap-y-4">
    {options.map((option) => (
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

const QuestionSection = ({ title }: { title: string }) => {
  return (
    <section className="mb-14 flex flex-col items-center">
      <img width={30} className="mb-3" src={thinkingIcon} alt="thinking" />
      <h2 className="text-lg font-bold">{title}</h2>
    </section>
  );
};

const Main = ({
  title,
  options,
  onAnswer,
}: {
  title: string;
  options: OptionType[];
  onAnswer: (id: string) => any;
}) => (
  <main>
    <QuestionSection title={title} />
    <OptionSection options={options} onAnswer={onAnswer} />
  </main>
);

type QuestionError = "expired-question" | "already-answered";

const ActualQuestion = ({
  question,
  forceUpdate,
}: {
  question: {
    id: string;
    createdAt: string;
    title: string;
    options: OptionType[];
  };
  forceUpdate: React.DispatchWithoutAction;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<QuestionError | null>(null);

  const onAnswer = async (optionId: string) => {
    const today = getLocalTime().format("YYYYMMDD");
    if (today !== question.createdAt) {
      return setError("expired-question");
    }
    setIsLoading(true);
    try {
      await answer(question.id, optionId);
      setIsLoading(false);
      forceUpdate();
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
        <Error.ExpiredQuestion
          onReload={() => {
            forceUpdate();
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
              <Header.Icon iconSrc={questionIcon} alt="question">
                오늘의 질문
              </Header.Icon>
            </Header.H1>
            <Badge className="ml-auto bg-primary-peach">
              {getFormattedDate()}
            </Badge>
          </Header>
          <Main
            title={question.title}
            options={question.options}
            onAnswer={onAnswer}
          />
          <Footer className="text-center">
            <Tip />
          </Footer>
          <ModalPortal>{isLoading && <Loading.Modal />}</ModalPortal>
        </>
      );
  }
};

const getQuestionPageData = async (user: User) => {
  const question = await getTodayQuestion();
  if (question.status === 204) {
    return { question: null };
  }

  const optionIds = question.data.options;
  const options = await getOptions({ ids: optionIds });

  const token = await user.getIdToken();
  const answers = await getMyAnswers(user.uid, token);
  const isAnswered =
    answers.filter((answer) => answer.question.id === question.data.id)
      .length !== 0;

  return {
    question: { ...question.data, options: options.data },
    isAnswered,
  };
};

const Question = () => {
  const { user } = useAuthenticatedState();
  const { state, data, forceUpdate } = useAsyncAPI(getQuestionPageData, user);

  switch (state) {
    case "loading":
      return <Loading.Full />;

    case "error":
      return <Error.Default />;

    case "loaded":
      if (data.isAnswered) {
        return <Navigate to="/answer" />;
      }
      if (data.question) {
        return (
          <ActualQuestion question={data.question} forceUpdate={forceUpdate} />
        );
      } else {
        return (
          <Error.Default>
            <article>
              오늘의 질문이 존재하지 않습니다.
              <br />
              <ExternalLink className="text-primary" href={URL_CS}>
                고객센터
              </ExternalLink>
              로 문의해 주세요.
            </article>
          </Error.Default>
        );
      }
  }
};

export default Question;
