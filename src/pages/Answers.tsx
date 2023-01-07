import { getAnswerGroups, getQuestion } from "../common/apis";
import useAsyncAPI from "../hooks/useAsyncAPI";
import { Answer as AnswerType } from "../@types";
import { getFormattedDate, groupBy } from "../common/utils";
import { useMyAnswers } from "../contexts/MyAnswersContext";
import { useTodayQuestions } from "../contexts/TodayQuestionContext";

import ErrorView from "../components/ErrorView";
import Loading from "../components/Loading";
import Header from "../components/Header";
import Box from "../components/Box";
import Notice from "../components/Notice";
import Question from "../components/Question";

type PageData = Awaited<ReturnType<typeof getAnswerGroups>>;

const MyAnswer = ({
  answer,
  options,
}: {
  answer: AnswerType;
  options: string[];
}) => {
  const { id, question: questionId, option: optionId } = answer;
  const { state, data: question } = useAsyncAPI(getQuestion, questionId);

  const sameAnswers = groupBy(options, (option) => option).get(optionId);
  const ratio = (sameAnswers?.length || 0) / options.length;

  if (state !== "loaded") {
    return (
      <Question
        createdAt=" "
        title="데이터를 불러오고 있어요 :)"
        option=" "
        linkProps={{
          to: id + "/report",
        }}
        ratio={ratio}
      />
    );
  }

  return (
    <Question
      createdAt={getFormattedDate(question.data.createdAt)}
      title={question.data.title}
      option={question.data.options[optionId]}
      linkProps={{ to: id + "/report", state: { question: question.data } }}
      ratio={ratio}
    />
  );
};

const TodayQuestion = () => {
  const { data: todayQuestions } = useTodayQuestions();
  const title = todayQuestions
    ? todayQuestions[0].title
    : "오늘의 질문이 없어요 :(";

  return (
    <Question
      className="mb-8"
      createdAt="TODAY"
      title={title}
      linkProps={{
        to: todayQuestions ? "/questions/" + todayQuestions[0].id : "/answer",
        state: { question: todayQuestions && todayQuestions[0] },
      }}
    />
  );
};

const AlreadyAnswered = () => (
  <Notice
    iconSrc="/images/writing_hand.png"
    alt="writing hand"
    className="mb-8 text-grayscale-60"
  >
    오늘 질문에 이미 대답하셨네요!
    <br />
    내일 또 재미있는 질문이 기다리고 있어요 :)
  </Notice>
);

const Main = ({ answersByQuestionIdMap }: PageData) => {
  const { data: todayQuestions } = useTodayQuestions();
  const { data: myAnswers } = useMyAnswers();

  const isEmptyMyAnswers = myAnswers.length === 0;
  const isAnsweredTodayQuestion =
    !isEmptyMyAnswers &&
    myAnswers[0].question === (todayQuestions && todayQuestions[0].id);

  return (
    <main>
      {!isAnsweredTodayQuestion ? (
        <section>
          <TodayQuestion />
        </section>
      ) : (
        <AlreadyAnswered />
      )}
      <Box.Container>
        {isEmptyMyAnswers ? (
          <div className="mt-12 text-center text-base text-grayscale-80">
            아직 질문에 응답한 내역이 없어요 :)
          </div>
        ) : (
          myAnswers.map((myAnswer) => (
            <MyAnswer
              key={myAnswer.id}
              answer={myAnswer}
              options={answersByQuestionIdMap[myAnswer.question]}
            />
          ))
        )}
      </Box.Container>
    </main>
  );
};

const ActualAnswers = ({ answersByQuestionIdMap }: PageData) => (
  <>
    <Header>
      <Header.H1 className="flex items-center">
        <Header.Icon iconSrc="/images/answer.png" alt="answer">
          나의 대답
        </Header.Icon>
      </Header.H1>
    </Header>
    <Main answersByQuestionIdMap={answersByQuestionIdMap} />
  </>
);

const Answers = () => {
  const { state, data: answerGroups } = useAsyncAPI(getAnswerGroups, {
    groups: ["question"],
  });

  switch (state) {
    case "loading":
      return <Loading.Full />;

    case "error":
      return <ErrorView.Default />;

    case "loaded":
      return (
        <ActualAnswers answersByQuestionIdMap={answerGroups["question"]} />
      );
  }
};

export default Answers;
