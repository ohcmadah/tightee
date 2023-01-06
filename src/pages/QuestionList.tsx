import { Link } from "react-router-dom";
import { getAnswerGroups } from "../common/apis";
import { getFormattedDate, getLocalTime, groupBy } from "../common/utils";
import useAsyncAPI from "../hooks/useAsyncAPI";
import { useMyAnswers } from "../contexts/MyAnswersContext";
import { useTodayQuestions } from "../contexts/TodayQuestionContext";
import { Question as QuestionType } from "../@types";
import { URL_CS } from "../common/constants";

import Box from "../components/Box";
import Chart from "../components/Chart";
import Img from "../components/Img";
import Badge from "../components/Badge";
import Icon from "../components/Icon";
import Loading from "../components/Loading";
import ErrorView from "../components/ErrorView";
import ExternalLink from "../components/ExternalLink";
import Header from "../components/Header";

const Question = ({
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
      <Box>
        <div className="my-6 px-2">
          <div className="mb-1.5 text-lg font-medium">{question.title}</div>
          <div className="mt-1.5 inline-flex items-start text-primary">
            <Icon src="/images/reply.svg" alt="reply" />
            <div>{question.options[myAnswer.option]}</div>
          </div>
        </div>
        <Link
          to={`/answer/${myAnswer.id}/report`}
          state={{ question }}
          className="flex w-full items-center justify-between"
        >
          <Chart.Summary value={ratio} className="mr-3 truncate text-ellipsis">
            {"전체 타이티 중에 {value}에 속해요."}
          </Chart.Summary>
          <Img
            lazy
            src="/images/right_arrow.svg"
            width={9}
            height={16}
            alt="arrow"
          />
        </Link>
      </Box>
    );
  }

  return (
    <article className="mb-8 flex w-full flex-col items-start rounded-2xl border border-grayscale-20 bg-white px-6 py-7 text-base drop-shadow-lg">
      <div className="mb-4 px-2 text-lg font-medium">{question.title}</div>
      <Link
        to={"/questions/" + question.id}
        state={{ question }}
        className="flex w-full items-center"
      >
        <Icon src="/images/reply.svg" alt="reply" />
        <div className="grow text-grayscale-20">대답하러 가기</div>
        <Img
          lazy
          src="/images/right_arrow.svg"
          width={9}
          height={16}
          alt="arrow"
        />
      </Link>
    </article>
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
          <Question
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
