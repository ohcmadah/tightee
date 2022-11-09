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
import { QueryDocumentSnapshot } from "firebase/firestore";

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

const Option = ({ id }: { id: string }) => {
  const { data } = useAsyncAPI(getOption, id);
  const option = data?.data() as OptionType;
  return data ? (
    <Button.Basic>{option.text}</Button.Basic>
  ) : (
    <ModalPortal>
      <Loading.Modal />
    </ModalPortal>
  );
};

const OptionSection = ({ options }: { options: QuestionType["options"] }) => {
  return (
    <section className="flex flex-col gap-y-4">
      {options.map(({ id }) => (
        <Option key={id} id={id} />
      ))}
    </section>
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

const Main = ({ data }: { data: QueryDocumentSnapshot[] }) => {
  const { title, options } = data[0].data() as QuestionType;
  return (
    <main key={title}>
      <QuestionSection title={title} />
      <OptionSection options={options} />
    </main>
  );
};

const Question = () => {
  const { data, error, isLoading } = useAsyncAPI(getTodayQuestions);

  return isLoading ? (
    <ModalPortal>
      <Loading.Modal />
    </ModalPortal>
  ) : data ? (
    <>
      <Header className="flex items-center" optionRenderer={<DateBadge />}>
        <Title />
      </Header>
      <Main data={data.docs} />
    </>
  ) : (
    <div>{`${error}`}</div>
  );
};

export default Question;
