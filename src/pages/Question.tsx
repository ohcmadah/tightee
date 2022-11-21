import { useState } from "react";
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
import Footer from "../components/Footer";
import DateBadge from "../components/DateBadge";
import ModalPortal from "../components/ModalPortal";

import questionIcon from "../assets/question.png";
import thinkingIcon from "../assets/thinking.png";
import lightIcon from "../assets/light.png";

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

const ActualQuestion = ({
  question,
  forceUpdate,
}: {
  question: QuestionType;
  forceUpdate: Function;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const onAnswer = async (optionId: string) => {
    setIsLoading(true);
    try {
      await answer(question.id, optionId);
    } catch (error) {}
    setIsLoading(false);
    forceUpdate();
  };

  return (
    <>
      <Header
        className="flex items-center"
        optionRenderer={<DateBadge className="ml-auto bg-primary-peach" />}
      >
        <Title />
      </Header>
      <Main question={question} onAnswer={onAnswer} />
      <Footer className="text-center">
        <Tip />
      </Footer>
      <ModalPortal>{isLoading && <Loading.Modal />}</ModalPortal>
    </>
  );
};

const Question = () => {
  const todayQuestion = useAsyncAPI(getTodayQuestion);
  const todayAnswer = useAsyncAPI(getTodayAnswer);

  if (todayQuestion.state === "error") {
    return <Error.Default />;
  }

  if (todayQuestion.state === "loading" || todayAnswer.state === "loading") {
    return <Loading.Full />;
  }

  if (todayAnswer.state === "loaded" && todayAnswer.data) {
    return <Navigate to="/answer" />;
  }

  if (todayQuestion.data.status === 200) {
    return (
      <ActualQuestion
        question={todayQuestion.data.data}
        forceUpdate={todayAnswer.forceUpdate}
      />
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
};

export default Question;
