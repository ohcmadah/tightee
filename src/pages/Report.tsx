import React, { useMemo } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
  getAnswer,
  getAnswers,
  getOption,
  getQuestion,
  getUser,
} from "../common/apis";
import useAsyncAPI from "../hooks/useAsyncAPI";
import { Answer, Question, User } from "../@types";
import { getFormattedDate, groupBy } from "../common/utils";
import { useAuthenticatedState } from "../contexts/AuthContext";

import Header from "../components/Header";
import Loading from "../components/Loading";
import Error from "../components/Error";
import Box from "../components/Box";
import Badge from "../components/Badge";

import replyIcon from "../assets/reply.svg";
import chartIcon from "../assets/chart.png";
import {
  ReportContextProvider,
  useReportState,
} from "../contexts/ReportContext";

const calcRatio = (
  group: Record<string, Answer[]>,
  total: number,
  target: any
) => {
  const key = typeof target === "string" ? target : JSON.stringify(target);
  return key in group ? Math.round((group[key].length / total) * 100) : 0;
};

const calcMBTIrank = (group: Record<string, Answer[]>) => {
  return Object.entries(group)
    .filter(([mbti, _]) => mbti !== "null")
    .map(([mbti, answers]) => {
      const answersByOptionIdMap = groupBy(answers, "option.id");
      const ratio =
        Math.max(...Object.values(answersByOptionIdMap).map((v) => v.length)) /
        answers.length;
      return { mbti, ratio };
    })
    .sort((a, b) => b.ratio - a.ratio);
};

const Reply = ({ children }: { children?: React.ReactNode }) => (
  <div className="flex items-center text-primary">
    <img src={replyIcon} alt="reply" className="mr-1.5" />
    {children}
  </div>
);

const Chart = ({ children }: { children?: React.ReactNode }) => (
  <div className="mt-5 flex items-center text-grayscale-80">
    <img width={20} src={chartIcon} alt="chart" className="mr-1.5" />
    {children}
  </div>
);

const Title = ({ icon, children }: { icon: string; children: string }) => (
  <Badge className="m-auto flex items-center bg-system-yellow text-base font-normal">
    <img src={icon} alt={children} className="mr-1.5" width={20} />
    {children}
  </Badge>
);

const DetailReport = () => {
  const { answer, answers, user, groups } = useReportState();

  return (
    <>
      <h2>상세 리포트</h2>
      <section>
        <Box.Container>
          <Box>
            <Reply>{answer.option.text}</Reply>
            <Chart>
              '{user.MBTI ?? "MBTI 없음"}' 유형의 타이티 중에&nbsp;
              <span className="text-primary">
                {calcRatio(groups.user.mbti, answers.length, user.MBTI)}%
              </span>
              가 같은 응답을 했어요.
            </Chart>
          </Box>
          <Box>
            <Reply>{answer.option.text}</Reply>
            <Chart>
              '{user.region}'에 사는 타이티 중에&nbsp;
              <span className="text-primary">
                {calcRatio(groups.user.region, answers.length, user.region)}%
              </span>
              가 같은 응답을 했어요.
            </Chart>
          </Box>
        </Box.Container>
      </section>
    </>
  );
};

const BasicReport = () => {
  const { answer, answers, groups } = useReportState();

  return (
    <section>
      <Box.Container>
        <Box>
          <Badge className="bg-question-not-today">
            {getFormattedDate(answer.question.createdAt)}
          </Badge>
          <div className="mt-3">{answer.question.title}</div>
        </Box>
        <Box>
          <Reply>{answer.option.text}</Reply>
          <Chart>
            전체 타이티 중에&nbsp;
            <span className="text-primary">
              {calcRatio(groups.option, answers.length, answer.option.id)}%
            </span>
            를 차지하고 있어요.
          </Chart>
        </Box>
        <Box>
          <Title icon={chartIcon}>MBTI 순위</Title>
          <Chart>16개 MBTI 중에서 N등으로 대답이 일치해요.</Chart>
          {calcMBTIrank(groups.user.mbti).map(({ mbti, ratio }) => (
            <div key={mbti}>
              {mbti}: {Math.round(ratio * 100)}%
            </div>
          ))}
        </Box>
      </Box.Container>
    </section>
  );
};

const ActualReport = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header>
        <Header.Back onClick={() => navigate(-1)}>리포트</Header.Back>
      </Header>
      <main>
        <BasicReport />
        <DetailReport />
      </main>
    </>
  );
};

const getQuestionAndOption = async (answerId: string, userId: string) => {
  const answer = await getAnswer(answerId);

  const questionId = answer.get("question").id;
  const question = await getQuestion(questionId);

  const optionId = answer.get("option").id;
  const option = await getOption(optionId);

  const answers = await getAnswers({ question: questionId });

  return {
    answer: {
      question: { ...(question.data() as Question), id: questionId },
      option: { id: optionId, text: option.get("text") },
    },
    answers: answers.data,
    user: (await getUser(userId)).data() as User,
  };
};

const Report = () => {
  const { answerId } = useParams();
  const { user } = useAuthenticatedState();

  if (!answerId) {
    return <Navigate to="/answer" />;
  }

  const { state, data } = useAsyncAPI(getQuestionAndOption, answerId, user.uid);

  switch (state) {
    case "loading":
      return <Loading.Full />;

    case "error":
      return <Error.Default />;

    case "loaded":
      return (
        <ReportContextProvider data={data}>
          <ActualReport />
        </ReportContextProvider>
      );
  }
};

export default Report;
