import { useNavigate } from "react-router-dom";
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
import Question from "../components/Question";
import Img from "../components/Img";

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
        createdAt="📅 ..."
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

const MyAnswers = ({ groups }: { groups: AnswerGroups }) => {
  const { data: myAnswers } = useMyAnswers();
  const isEmptyMyAnswers = myAnswers.length === 0;

  return (
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
            options={groups["question"][myAnswer.question]}
          />
        ))
      )}
    </Box.Container>
  );
};

const TodayQuestions = () => {
  const navigate = useNavigate();
  const { data: todayQuestions } = useTodayQuestions();
  const { data: myAnswers } = useMyAnswers();

  if (!todayQuestions) {
    return (
      <section className="mb-8">
        <Question
          createdAt="TODAY"
          title="오늘의 질문이 존재하지 않아요 :("
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

  if (!isAllAnswered) {
    return (
      <Box.Container className="mb-8">
        <Box className="cursor-pointer" onClick={() => navigate("/questions")}>
          <div className="flex w-full items-center justify-between text-sm">
            <span className="mr-3">
              아직 대답하지 않은 오늘의 질문이 있어요
            </span>
            <Img src="/images/right_arrow.svg" />
          </div>
        </Box>
      </Box.Container>
    );
  }

  return null;
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
                나의 대답
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
