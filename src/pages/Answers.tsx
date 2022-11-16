import { getAnswers } from "../common/apis";
import useAsyncAPI from "../hooks/useAsyncAPI";

import Error from "../components/Error";
import Loading from "../components/Loading";
import { Answer as AnswerType } from "../@types";

const Answer = ({ answer }: { answer: AnswerType }) => {
  return <div>{answer.option.text}</div>;
};

const Answers = () => {
  const { state, data, forceUpdate } = useAsyncAPI(getAnswers);

  switch (state) {
    case "loading":
      return <Loading.Full />;

    case "loaded":
      return (
        <div>
          {data.data.map((answer) => (
            <Answer key={answer.id} answer={answer} />
          ))}
        </div>
      );

    case "error":
      return <Error.Default />;
  }
};

export default Answers;
