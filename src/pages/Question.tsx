import moment from "moment";
import { getTodayQuestion } from "../common/apis";
import useAsyncAPI from "../hooks/useAsyncAPI";

import Header from "../components/Header";
import Button from "../components/Button";
import Loading from "../components/Loading";

import questionIcon from "../assets/question.png";
import thinkingIcon from "../assets/thinking.png";

import { Option as OptionType, Question as QuestionType } from "../@types";

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

const OptionSection = ({ options }: { options: OptionType[] }) => (
  <section className="flex flex-col gap-y-4">
    {options.map((option) => (
      <Button.Basic key={option.text}>{option.text}</Button.Basic>
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

const Main = ({ question }: { question?: QuestionType }) => (
  <main>
    <QuestionSection title={question?.title || ""} />
    <OptionSection options={question?.options || []} />
  </main>
);

const Question = () => {
  const { data, error, isLoading } = useAsyncAPI(getTodayQuestion);

  if (isLoading) {
    return <Loading.Full />;
  }

  if (error) {
    return <div>{`${error}`}</div>;
  }

  if (data?.status === 200) {
    return (
      <>
        <Header className="flex items-center" optionRenderer={<DateBadge />}>
          <Title />
        </Header>
        <Main question={data?.data} />
      </>
    );
  } else {
    return <div>{`${data?.statusText}`}</div>;
  }
};

export default Question;
