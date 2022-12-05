import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
  getAnswer,
  getAnswers,
  getOption,
  getQuestion,
  getUser,
} from "../common/apis";
import useAsyncAPI from "../hooks/useAsyncAPI";
import { Answer, MBTI, Question, User } from "../@types";
import {
  formatPercent,
  getFormattedDate,
  getProperty,
  groupBy,
} from "../common/utils";
import { useAuthenticatedState } from "../contexts/AuthContext";
import {
  ReportContextProvider,
  useReportState,
} from "../contexts/ReportContext";

import Header from "../components/Header";
import Loading from "../components/Loading";
import Error from "../components/Error";
import Box from "../components/Box";
import Badge from "../components/Badge";
import Chart from "../components/Chart";

import replyIcon from "../assets/reply.svg";
import rankIcon from "../assets/rank.png";

const genChartData = (
  answers: Answer[]
): { [optionId: string]: { title: string; ratio: number } } => {
  const total = answers.length;
  const group = groupBy(answers, (answer) => answer.option.id);

  return Array.from(group).reduce((acc, [optionId, answers]) => {
    const ratio = answers.length / total;
    return { ...acc, [optionId]: { title: answers[0].option.text, ratio } };
  }, {});
};

const calcMBTIrank = (group: Map<MBTI, Answer[]>) => {
  return Array.from(group)
    .filter(([mbti, _]) => mbti !== null)
    .map(([mbti, answers]) => {
      const data = genChartData(answers);
      const { title, ratio } = Object.values(data).sort(
        (a, b) => a.ratio - b.ratio
      )[0];
      return { mbti, option: title, ratio };
    })
    .sort((a, b) => b.ratio - a.ratio);
};

const Reply = ({ children }: { children?: React.ReactNode }) => (
  <div className="mb-5 flex items-center text-primary">
    <img src={replyIcon} alt="reply" className="mr-1.5" />
    {children}
  </div>
);

const Title = ({ icon, children }: { icon: string; children: string }) => (
  <Badge className="m-auto mb-5 flex items-center bg-system-yellow text-base font-normal">
    <img src={icon} alt={children} className="mr-1.5" width={20} />
    {children}
  </Badge>
);

const DetailReport = () => {
  const { answer, user, groups } = useReportState();

  const mbti = genChartData(groups.user.mbti.get(user.MBTI) || []);
  const region = genChartData(groups.user.region.get(user.region) || []);

  return (
    <>
      <h2>상세 리포트</h2>
      <section>
        <Box.Container>
          <Box>
            <Reply>{answer.option.text}</Reply>
            <Chart.Summary value={mbti[answer.option.id].ratio}>
              {`'${user.MBTI}' 유형의 타이티 중에 {value}가 같은 응답을 했어요.`}
            </Chart.Summary>
          </Box>
          <Box>
            <Reply>{answer.option.text}</Reply>
            <Chart.Summary
              value={region[answer.option.id].ratio}
            >{`'${user.region}'에 사는 타이티 중에 {value}가 같은 응답을 했어요.`}</Chart.Summary>
          </Box>
        </Box.Container>
      </section>
    </>
  );
};

const BasicReport = () => {
  const { answer, answers, groups, user } = useReportState();

  const optionData = genChartData(answers || []);
  const mbtiRank = calcMBTIrank(groups.user.mbti);

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
          <Chart.Summary value={optionData[answer.option.id].ratio}>
            {`전체 타이티 중에 {value}를 차지하고 있어요.`}
          </Chart.Summary>
          <Chart data={optionData} id={answer.option.id}>
            <Chart.Pie className="m-auto my-7" size="33%" />
            <Chart.Regend />
          </Chart>
        </Box>
        <Box>
          <Title icon={rankIcon}>MBTI 순위</Title>
          <Chart.Summary
            value={
              mbtiRank.map((value) => value.mbti).indexOf(user.MBTI) + 1 + "등"
            }
          >
            {"16개 MBTI 중에서 {value}으로 대답이 일치해요."}
          </Chart.Summary>
          {mbtiRank.map(({ mbti, option, ratio }, index) => (
            <div key={mbti} className="mt-5">
              {index + 1} {mbti}{" "}
              <span className="text-grayscale-60">
                ({option}, {formatPercent(ratio)})
              </span>
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
