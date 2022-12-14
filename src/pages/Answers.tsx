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

type AnswerGroups = Awaited<ReturnType<typeof getAnswerGroups>>;

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
        createdAt="π ..."
        title="λ°μ΄ν°λ₯Ό λΆλ¬μ€κ³  μμ΄μ :)"
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

const MyAnswers = ({ groups }: { groups: AnswerGroups }) => {
  const { data: myAnswers } = useMyAnswers();
  const isEmptyMyAnswers = myAnswers.length === 0;

  return (
    <Box.Container>
      {isEmptyMyAnswers ? (
        <div className="mt-12 text-center text-base text-grayscale-80">
          μμ§ μ§λ¬Έμ μλ΅ν λ΄μ­μ΄ μμ΄μ :)
        </div>
      ) : (
        myAnswers.map((myAnswer) => (
          <MyAnswer
            key={myAnswer.id}
            answer={myAnswer}
            options={groups["question"][myAnswer.question]}
          />
        ))
      )}
    </Box.Container>
  );
};

const AlreadyAnswered = () => (
  <Notice
    iconSrc="/images/writing_hand.png"
    alt="writing hand"
    className="mb-8 text-grayscale-60"
  >
    μ€λ μ§λ¬Έλ€μ λͺ¨λ λλ΅νμ¨λ€μ!
    <br />
    λ΄μΌ λ μ¬λ―Έμλ μ§λ¬Έμ΄ κΈ°λ€λ¦¬κ³  μμ΄μ :)
  </Notice>
);

const TodayQuestions = () => {
  const { data: todayQuestions } = useTodayQuestions();
  const { data: myAnswers } = useMyAnswers();

  if (!todayQuestions) {
    return (
      <section className="mb-8">
        <Question
          createdAt="TODAY"
          title="μ€λμ μ§λ¬Έμ΄ μ‘΄μ¬νμ§ μμμ :("
          linkProps={{ to: "/answer" }}
        />
      </section>
    );
  }

  const answeredQuestionIds = new Set(
    myAnswers.map(({ question }) => question)
  );
  const isAllAnswered = todayQuestions.every(({ id }) =>
    answeredQuestionIds.has(id)
  );

  if (isAllAnswered) {
    return <AlreadyAnswered />;
  }

  return (
    <Box.Container className="mb-8">
      {todayQuestions.map(
        (question) =>
          !answeredQuestionIds.has(question.id) && (
            <Question
              key={question.id}
              createdAt="TODAY"
              title={question.title}
              linkProps={{
                to: "/questions/" + question.id,
                state: { question },
              }}
            />
          )
      )}
    </Box.Container>
  );
};

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
        <>
          <Header>
            <Header.H1 className="flex items-center">
              <Header.Icon iconSrc="/images/answer.png" alt="answer">
                λμ λλ΅
              </Header.Icon>
            </Header.H1>
          </Header>
          <main>
            <TodayQuestions />
            <MyAnswers groups={answerGroups} />
          </main>
        </>
      );
  }
};

export default Answers;
