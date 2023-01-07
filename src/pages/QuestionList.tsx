import { getAnswerGroups } from "../common/apis";
import { getFormattedDate, getLocalTime, groupBy } from "../common/utils";
import useAsyncAPI from "../hooks/useAsyncAPI";
import { useMyAnswers } from "../contexts/MyAnswersContext";
import { useTodayQuestions } from "../contexts/TodayQuestionContext";
import { Question as QuestionType } from "../@types";
import { URL_CS } from "../common/constants";

import Box from "../components/Box";
import Badge from "../components/Badge";
import Loading from "../components/Loading";
import ErrorView from "../components/ErrorView";
import ExternalLink from "../components/ExternalLink";
import Header from "../components/Header";
import Question from "../components/Question";

const TodayQuestion = ({
  question,
  options,
}: {
  question: QuestionType;
  options: string[];
}) => {
  const { data: myAnswers } = useMyAnswers();
  const myAnswer = myAnswers.find((v) => v.question === question.id);

  if (myAnswer) {
    const sameAnswers = groupBy(options, (option) => option).get(
      myAnswer?.option
    );
    const ratio = (sameAnswers?.length || 0) / options.length;
    return (
      <Question
        className="px-6 py-7"
        title={question.title}
        option={question.options[myAnswer.option]}
        linkProps={{ to: `/answer/${myAnswer.id}/report`, state: { question } }}
        ratio={ratio}
      />
    );
  }

  return (
    <Question
      className="px-6 py-7"
      title={question.title}
      linkProps={{ to: "/questions/" + question.id, state: { question } }}
    />
  );
};

type PageData = Awaited<ReturnType<typeof getAnswerGroups>>;

const Main = ({ answersByQuestionIdMap }: PageData) => {
  const { data: questions } = useTodayQuestions();

  if (!questions) {
    return (
      <ErrorView.Default>
        <article>
          오늘의 질문이 존재하지 않습니다.
          <br />
          <ExternalLink className="text-primary" href={URL_CS}>
            고객센터
          </ExternalLink>
          로 문의해 주세요.
        </article>
      </ErrorView.Default>
    );
  }

  return (
    <main className="flex flex-col items-center">
      <Badge className="mb-10 bg-primary-peach">
        {getFormattedDate(getLocalTime())}
      </Badge>
      <Box.Container>
        {questions.map((question) => (
          <TodayQuestion
            key={question.id}
            question={question}
            options={answersByQuestionIdMap[question.id]}
          />
        ))}
      </Box.Container>
    </main>
  );
};

const QuestionList = () => {
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
          <Header className="flex items-center">
            <Header.H1>
              <Header.Icon iconSrc="/images/question.png" alt="question">
                오늘의 질문
              </Header.Icon>
            </Header.H1>
          </Header>
          <Main answersByQuestionIdMap={answerGroups["question"]} />
        </>
      );
  }
};

export default QuestionList;
