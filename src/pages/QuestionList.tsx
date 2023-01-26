import { getAnswerGroups } from "../common/apis";
import { getFormattedDate, getLocalTime, groupBy } from "../common/utils";
import useAsyncAPI from "../hooks/useAsyncAPI";
import { useMyAnswers } from "../contexts/MyAnswersContext";
import { useTodayQuestions } from "../contexts/TodayQuestionContext";
import { Question as QuestionType } from "../@types";
import { URL_CS, URL_QUESTION_GOOGLE_FORM } from "../common/constants";

import Box from "../components/Box";
import Badge from "../components/Badge";
import Loading from "../components/Loading";
import ErrorView from "../components/ErrorView";
import ExternalLink from "../components/ExternalLink";
import Header from "../components/Header";
import Question from "../components/Question";
import Notice from "../components/Notice";
import Icon from "../components/Icon";
import Footer from "../components/Footer";
import Img from "../components/Img";

const FormButton = () => {
  const openInNewTab = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Footer.Floating
      className="bottom-nav mt-4"
      color="violet"
      onClick={() => openInNewTab(URL_QUESTION_GOOGLE_FORM)}
    >
      <Icon src="/images/letter.png" alt="letter" className="mr-3" />
      <div className="text-left font-medium">
        평소에 궁금한 게 있었나요?
        <br />
        질문을 접수하면 타이티에 올려드려요!
      </div>
      <Img
        width={9}
        lazy
        src="/images/right_arrow_white.svg"
        alt="right arrow"
        className="ml-auto inline-block"
      />
    </Footer.Floating>
  );
};

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

const Main = ({ answersByQuestionIdMap }: PageData) => {
  const { data: questions } = useTodayQuestions();
  const { data: myAnswers } = useMyAnswers();

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

  const answeredQuestionIds = new Set(
    myAnswers.map(({ question }) => question)
  );
  const isAlreadyAnswered = questions.every(({ id }) =>
    answeredQuestionIds.has(id)
  );

  return (
    <main className="flex flex-col items-center">
      <Badge className="mb-10 bg-primary-peach">
        {getFormattedDate(getLocalTime())}
      </Badge>
      {isAlreadyAnswered && <AlreadyAnswered />}
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
          <FormButton />
        </>
      );
  }
};

export default QuestionList;