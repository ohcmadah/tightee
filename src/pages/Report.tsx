import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { getAnswer, getAnswers } from "../common/apis";
import useAsyncAPI from "../hooks/useAsyncAPI";
import { Answer, MBTI } from "../@types";
import { formatPercent, getFormattedDate, groupBy } from "../common/utils";
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
import Icon from "../components/Icon";

import replyIcon from "../assets/reply.svg";
import rankIcon from "../assets/rank.png";
import goldIcon from "../assets/gold.png";
import silverIcon from "../assets/silver.png";
import bronzeIcon from "../assets/bronze.png";

const RANK_ICONS = [goldIcon, silverIcon, bronzeIcon];

const genChartData = (
  answers: Answer[]
): { [optionId: string]: { title: string; ratio: number } } => {
  const total = answers.length;
  const group = groupBy(answers, (answer) => answer.option.id);

  return Array.from(group).reduce((acc, [optionId, answers]) => {
    const ratio = answers.length / total;
    return {
      ...acc,
      [optionId]: { title: answers[0].option.text, ratio: ratio },
    };
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
    <Icon src={replyIcon} alt="reply" />
    {children}
  </div>
);

const Title = ({ icon, children }: { icon: string; children: string }) => (
  <Badge className="m-auto mb-5 flex items-center bg-system-yellow text-base font-normal">
    <Icon src={icon} alt={children} />
    {children}
  </Badge>
);

const DetailReport = () => {
  const { answer, groups } = useReportState();

  const mbti = genChartData(groups.user.mbti.get(answer.user.MBTI) || []);
  const region = genChartData(groups.user.region.get(answer.user.region) || []);

  return (
    <>
      <h2>상세 리포트</h2>
      <section>
        <Box.Container>
          <Box>
            <Reply>{answer.option.text}</Reply>
            <Chart.Summary value={mbti[answer.option.id].ratio}>
              {`'${answer.user.MBTI}' 유형의 타이티 중에 {value}가 같은 응답을 했어요.`}
            </Chart.Summary>
          </Box>
          <Box>
            <Reply>{answer.option.text}</Reply>
            <Chart.Summary
              value={region[answer.option.id].ratio}
            >{`'${answer.user.region}'에 사는 타이티 중에 {value}가 같은 응답을 했어요.`}</Chart.Summary>
          </Box>
        </Box.Container>
      </section>
    </>
  );
};

const MBTIRankReport = () => {
  const { answer, groups } = useReportState();

  if (answer.user.MBTI === null) {
    return (
      <Box>
        <Title icon={rankIcon}>MBTI 순위</Title>
        <div className="text-grayscale-80">
          아직 MBTI를 입력하지 않았어요.
          <br />
          MBTI를 입력하고 지금 바로 결과를 확인하세요 :)
        </div>
        <Link to="/profile" className="mt-3 font-medium text-primary">
          {"바로가기 >"}
        </Link>
      </Box>
    );
  }

  const rank = calcMBTIrank(groups.user.mbti);
  const myRank = rank.map((value) => value.mbti).indexOf(answer.user.MBTI) + 1;

  return (
    <Box>
      <Title icon={rankIcon}>MBTI 순위</Title>
      <Chart.Summary value={myRank + "등"}>
        {"16개 MBTI 중에서 {value}으로 대답이 일치해요."}
      </Chart.Summary>
      {rank.map(({ mbti, option, ratio }, index) => (
        <div key={mbti} className="mt-5">
          <Icon src={RANK_ICONS[index]} alt={`${index + 1}등`} />
          {mbti}{" "}
          <span className="text-grayscale-60">
            ({option}, {formatPercent(ratio)})
          </span>
        </div>
      ))}
    </Box>
  );
};

const BasicReport = () => {
  const { answer, answers } = useReportState();

  const optionData = genChartData(answers || []);

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

        <MBTIRankReport />
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

const getMyAnswerAndAnswers = async (answerId: string) => {
  const answer = await getAnswer(answerId);
  const answers = await getAnswers({ question: answer.question.id });

  return {
    answer,
    answers: answers.data,
  };
};

const Report = () => {
  const { answerId } = useParams();

  if (!answerId) {
    return <Navigate to="/answer" />;
  }

  const { state, data } = useAsyncAPI(getMyAnswerAndAnswers, answerId);

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
