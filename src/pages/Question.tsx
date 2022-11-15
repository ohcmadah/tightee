import moment from "moment";
import { Navigate } from "react-router-dom";
import { answer, getTodayAnswer, getTodayQuestion } from "../common/apis";
import useAsyncAPI from "../hooks/useAsyncAPI";
import { URL_CS } from "../common/constants";
import { Option as OptionType, Question as QuestionType } from "../@types";

import Header from "../components/Header";
import Button from "../components/Button";
import Loading from "../components/Loading";
import Error from "../components/Error";
import ExternalLink from "../components/ExternalLink";

import questionIcon from "../assets/question.png";
import thinkingIcon from "../assets/thinking.png";
import { useState } from "react";
import ModalPortal from "../components/ModalPortal";

const DateBadge = () => (
  <div className="ml-auto inline-block rounded-full bg-primary-peach py-1.5 px-6 text-base font-normal">
    {moment().format("YY.MM.DD(ddd)")}
  </div>
);

const Title = () => (
  <>
    <img
      width={40}
      className="mr-4 inline-block"
      src={questionIcon}
      alt="question"
    />
    <span className="align-middle">오늘의 질문</span>
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

const ActualQuestion = ({ question }: { question: QuestionType }) => {
  const [isLoading, setIsLoading] = useState(false);

  const onAnswer = async (optionId: string) => {
    setIsLoading(true);
    try {
      await answer(question.id, optionId);
    } catch (error) {}
    setIsLoading(false);
    // TODO:
    location.reload();
  };

  return (
    <>
      <Header className="flex items-center" optionRenderer={<DateBadge />}>
        <Title />
      </Header>
      <Main question={question} onAnswer={onAnswer} />
      <ModalPortal>{isLoading && <Loading.Modal />}</ModalPortal>
    </>
  );
};

const Question = () => {
  const todayQuestion = useAsyncAPI(getTodayQuestion);
  const todayAnswer = useAsyncAPI(getTodayAnswer);

  if (todayQuestion.error || todayAnswer.error) {
    return <Error.Default />;
  }

  if (todayQuestion.isLoading || !todayQuestion.data || todayAnswer.isLoading) {
    return <Loading.Full />;
  }

  if (!todayAnswer.data?.empty) {
    return <Navigate to="/answer" />;
  }

  if (todayQuestion.data.status === 200) {
    return <ActualQuestion question={todayQuestion.data.data} />;
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
};

export default Question;
