import { getAnswers } from "../common/apis";
import useAsyncAPI from "../hooks/useAsyncAPI";
import { Answer as AnswerType } from "../@types";

import Error from "../components/Error";
import Loading from "../components/Loading";
import Header from "../components/Header";

import answerIcon from "../assets/answer.png";

const Answer = ({ answer }: { answer: AnswerType }) => {
  const { question, option, ratio } = answer;
  return (
    <ul className="last:mb-0">
      <li className="mb-8 w-full bg-white p-6 drop-shadow-md">
        <span className="rounded-full bg-primary-peach p-3">
          {question.createdAt}
        </span>
        <div>{question.title}</div>
        <div>{option.text}</div>
        <div>
          전체 타이티 중에 <span className="text-primary">{ratio * 100}%</span>
          를 차지하고 있어요.
        </div>
      </li>
    </ul>
  );
};

const Main = ({ answers }: { answers: AnswerType[] }) => (
  <main>
    {answers.map((answer) => (
      <Answer key={answer.id} answer={answer} />
    ))}
  </main>
);

const Title = () => (
  <>
    <img
      width={40}
      className="mr-4 inline-block"
      src={answerIcon}
      alt="answer"
    />
    <span className="align-middle">나의 대답</span>
  </>
);

const ActualAnswers = ({ answers }: { answers: AnswerType[] }) => (
  <>
    <Header className="flex items-center">
      <Title />
    </Header>
    <Main answers={answers} />
  </>
);

const Answers = () => {
  const { state, data, forceUpdate } = useAsyncAPI(getAnswers);

  switch (state) {
    case "loading":
      return <Loading.Full />;

    case "error":
      return <Error.Default />;

    case "loaded":
      return <ActualAnswers answers={data.data} />;
  }
};

export default Answers;
