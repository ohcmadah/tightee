import { getFormattedDate, getLocalTime, groupBy } from "../common/utils";
import { Answer, Question as QuestionType } from "../@types";
import { URL_CS } from "../common/constants";
import { useMyAnswersQuery } from "../hooks/queries/useMyAnswersQuery";
import { useAnswerGroupsQuery } from "../hooks/queries/useAnswerGroupsQuery";
import { useQuestionsQuery } from "../hooks/queries/useQuestionsQuery";
import { auth } from "../config";

import Box from "../components/Box";
import Badge from "../components/Badge";
import Skeleton from "../components/Skeleton";
import ErrorView from "../components/ErrorView";
import ExternalLink from "../components/ExternalLink";
import Header from "../components/Header";
import Question from "../components/Question";
import Notice from "../components/Notice";
import Button from "../components/Button";

const TodayQuestion = ({
  myAnswer,
  question,
  options,
}: {
  myAnswer?: Answer;
  question: QuestionType;
  options: string[];
}) => {
  if (myAnswer) {
    if (!options) {
      return <Skeleton.BoxLoader key={question.id} />;
    }
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

const AlreadyAnswered = () => (
  <Notice
    iconSrc="/images/writing_hand.png"
    alt="writing hand"
    className="mb-8 text-grayscale-60"
  >
    오늘 질문들에 모두 대답하셨네요!
    <br />
    내일 또 재미있는 질문이 기다리고 있어요 :)
  </Notice>
);

const Main = () => {
  const groups = useAnswerGroupsQuery(["question"]);
  const today = getLocalTime().format("YYYYMMDD");
  const questions = useQuestionsQuery([today], { date: today });
  const myAnswers = useMyAnswersQuery(auth.currentUser?.uid);

  if (groups.isLoading || questions.isLoading || myAnswers.isLoading) {
    return (
      <main className="flex flex-col items-center">
        <Badge className="mb-10 bg-primary-peach">
          {getFormattedDate(getLocalTime())}
        </Badge>
        <Box.Container>
          {[1, 2, 3].map((n) => (
            <Skeleton.BoxLoader key={n} />
          ))}
        </Box.Container>
      </main>
    );
  }

  if (groups.isError || questions.isError || myAnswers.isError) {
    return <ErrorView.Default />;
  }

  if (questions.data.length === 0) {
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

  const answeredQuestionIds = new Set(
    myAnswers.data.map(({ question }) => question)
  );
  const isAlreadyAnswered = questions.data.every(({ id }) =>
    answeredQuestionIds.has(id)
  );
  const answersByQuestionIdMap = groups.data["question"];

  return (
    <main className="flex flex-col items-center">
      <Badge className="mb-10 bg-primary-peach">
        {getFormattedDate(getLocalTime())}
      </Badge>
      {isAlreadyAnswered && <AlreadyAnswered />}
      <Box.Container>
        {questions.data.map((question) => (
          <TodayQuestion
            key={question.id}
            myAnswer={myAnswers.data.find((v) => v.question === question.id)}
            question={question}
            options={answersByQuestionIdMap[question.id]}
          />
        ))}
      </Box.Container>
    </main>
  );
};

const QuestionList = () => (
  <>
    <Header className="flex items-center">
      <Header.H1>
        <Header.Icon iconSrc="/images/question.png" alt="question">
          오늘의 질문
        </Header.Icon>
      </Header.H1>
    </Header>
    <Main />
    <Button.GoogleForm />
  </>
);

export default QuestionList;
