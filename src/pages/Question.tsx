import { useEffect, useState } from "react";
import moment from "moment";
import useAsyncAPI from "../hooks/useAsyncAPI";

import Header from "../components/Header";
import Button from "../components/Button";
import { getOption, getTodayQuestions } from "../common/apis";
import Loading from "../components/Loading";
import ModalPortal from "../components/ModalPortal";

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

const OptionSection = ({ options }: { options: Promise<OptionType>[] }) => {
  const { data } = useAsyncAPI(async () => {
    return await Promise.allSettled(options);
  });
  return (
    data && (
      <section className="flex flex-col gap-y-4">
        {data.map((result) => {
          return (
            result.status === "fulfilled" && (
              <Button.Basic>{result.value.text}</Button.Basic>
            )
          );
        })}
      </section>
    )
  );
};

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
  options,
}: {
  question?: QuestionType;
  options?: Promise<OptionType>[];
}) => (
  <main>
    <QuestionSection title={question?.title || ""} />
    <OptionSection options={options || []} />
  </main>
);

const PopupRenderer = ({ isLoading }: { isLoading: boolean }) =>
  isLoading ? (
    <ModalPortal>
      <Loading.Modal />
    </ModalPortal>
  ) : (
    <></>
  );

const getQuestionAndOptions = async () => {
  const questions = await getTodayQuestions();
  if (questions.docs.length === 0) {
    return null;
  }
  const question = questions.docs[0].data() as QuestionType;
  const options = question.options.map(async (option) => {
    const doc = await getOption(option.id);
    return doc.data() as OptionType;
  });
  return { question, options };
};

const Question = () => {
  const res = useAsyncAPI(getQuestionAndOptions);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (res.error) {
      return setError("에러가 발생했습니다.");
    }
    if (!res.isLoading && !res.data) {
      return setError("오늘의 질문이 존재하지 않습니다.");
    }
  }, [res]);

  return !error ? (
    <>
      <Header className="flex items-center" optionRenderer={<DateBadge />}>
        <Title />
      </Header>
      <Main question={res.data?.question} options={res.data?.options} />
      <PopupRenderer isLoading={res.isLoading} />\
    </>
  ) : (
    <div>{error}</div>
  );
};

export default Question;
